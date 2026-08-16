import type Stripe from 'stripe';
import {
  DEFAULT_DONATION_CURRENCY,
  DONATION_STATUSES,
  MAX_DONATION_AMOUNT_CENTS,
  MIN_DONATION_AMOUNT_CENTS,
} from '../constants/donation.js';
import { env } from '../config/env.js';
import { BadRequestError } from '../errors/BadRequestError.js';
import { campaignRepository } from '../repositories/CampaignRepository.js';
import { donationRepository } from '../repositories/DonationRepository.js';
import { BaseService } from './BaseService.js';
import type { CreateDonationInput } from '../schemas/donation.schema.js';
import type { IDonation } from '../models/Donation.model.js';
import type { DonationStatus } from '../constants/donation.js';
import { toDonationResponse, toPublicDonationSummary } from '../types/donation.types.js';
import { verifyRecaptchaToken } from '../utils/recaptcha.js';
import { getStripe } from '../utils/stripe.js';
import { logger } from '../utils/logger.js';

export type DonationListParams = {
  search?: string;
  status?: DonationStatus;
  page?: number;
  limit?: number;
};

export type CreateDonationCheckoutResult = {
  donation: ReturnType<typeof toDonationResponse>;
  checkoutUrl: string;
};

class DonationService extends BaseService<IDonation> {
  constructor() {
    super(donationRepository);
  }

  private dollarsToCents(amount: number): number {
    return Math.round(amount * 100);
  }

  async createCheckout(input: CreateDonationInput): Promise<CreateDonationCheckoutResult> {
    await verifyRecaptchaToken(input.recaptchaToken);

    const amountCents = this.dollarsToCents(input.amount);

    if (amountCents < MIN_DONATION_AMOUNT_CENTS) {
      throw new BadRequestError(`Minimum donation is $${MIN_DONATION_AMOUNT_CENTS / 100}`);
    }

    if (amountCents > MAX_DONATION_AMOUNT_CENTS) {
      throw new BadRequestError(`Maximum donation is $${MAX_DONATION_AMOUNT_CENTS / 100}`);
    }

    const donation = await donationRepository.create({
      donorName: input.donorName,
      email: input.email,
      phone: input.phone?.trim() || undefined,
      country: input.country?.trim() || undefined,
      amountCents,
      currency: DEFAULT_DONATION_CURRENCY,
      status: DONATION_STATUSES.PENDING,
      campaignId: undefined,
    });

    const campaignSlug = input.campaignSlug?.trim();
    if (campaignSlug) {
      const campaign = await campaignRepository.findBySlug(campaignSlug);
      if (campaign) {
        donation.campaignId = campaign._id;
        await donation.save();
      }
    }

    const stripe = getStripe();
    const frontendUrl = env.FRONTEND_URL.replace(/\/$/, '');

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: input.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: DEFAULT_DONATION_CURRENCY,
            unit_amount: amountCents,
            product_data: {
              name: 'Donation to BND Foundation',
              description: 'Tax-deductible donation where applicable ($2+ in Australia)',
            },
          },
        },
      ],
      metadata: {
        donationId: donation.id,
      },
      success_url: `${frontendUrl}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/donate/cancel`,
    });

    if (!session.url) {
      throw new BadRequestError('Unable to start Stripe checkout. Please try again.');
    }

    donation.stripeCheckoutSessionId = session.id;
    await donation.save();

    return {
      donation: toDonationResponse(donation),
      checkoutUrl: session.url,
    };
  }

  /** Mark donation paid from Stripe session (webhook or success-page confirm). */
  async markPaidFromCheckoutSession(session: Stripe.Checkout.Session) {
    const donationId = session.metadata?.donationId;
    let donation = donationId
      ? await donationRepository.findById(donationId)
      : null;

    if (!donation && session.id) {
      donation = await donationRepository.findByStripeCheckoutSessionId(session.id);
    }

    if (!donation) {
      logger.warn('Stripe session has no matching donation', { sessionId: session.id });
      return null;
    }

    if (donation.status === DONATION_STATUSES.PAID) {
      return toDonationResponse(donation);
    }

    const paymentIntentId =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent?.id;

    donation.status = DONATION_STATUSES.PAID;
    donation.stripeCheckoutSessionId = session.id;
    if (paymentIntentId) {
      donation.stripePaymentIntentId = paymentIntentId;
      donation.transactionId = paymentIntentId;
    }
    await donation.save();

    return toDonationResponse(donation);
  }

  async confirmCheckoutSession(sessionId: string) {
    if (!sessionId.startsWith('cs_')) {
      throw new BadRequestError('Invalid Stripe session');
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid' && session.status !== 'complete') {
      throw new BadRequestError('Payment has not been completed yet');
    }

    const donation = await this.markPaidFromCheckoutSession(session);
    if (!donation) {
      throw new BadRequestError('Donation not found for this payment');
    }

    return donation;
  }

  async handleStripeWebhook(rawBody: Buffer, signature: string) {
    const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new BadRequestError(
        'STRIPE_WEBHOOK_SECRET is not configured. Use Stripe CLI for local webhooks.',
      );
    }

    const stripe = getStripe();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch {
      throw new BadRequestError('Invalid Stripe webhook signature');
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      await this.markPaidFromCheckoutSession(session);
    }

    return { received: true };
  }

  async list(params: DonationListParams) {
    const result = await donationRepository.findWithFilters(params);

    return {
      data: result.data.map(toDonationResponse),
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }

  async getById(id: string) {
    const donation = await this.getByIdOrFail(id, 'Donation not found');
    return toDonationResponse(donation);
  }

  async remove(id: string) {
    await donationRepository.deleteByIdOrFail(id, 'Donation not found');
  }

  async countPending() {
    return donationRepository.countByStatus(DONATION_STATUSES.PENDING);
  }

  async getRecentPublic(limit = 10) {
    const donations = await donationRepository.findRecentPaid(limit);
    return donations.map(toPublicDonationSummary);
  }

  async getTopDonorsPublic(limit = 10) {
    return donationRepository.findTopDonors(limit);
  }
}

export const donationService = new DonationService();
