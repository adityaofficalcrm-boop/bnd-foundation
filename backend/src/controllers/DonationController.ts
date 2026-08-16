import type { Request, Response } from 'express';
import { BaseController } from './BaseController.js';
import { donationService } from '../services/DonationService.js';
import type { CreateDonationInput, DonationListQuery } from '../schemas/donation.schema.js';
import { BadRequestError } from '../errors/BadRequestError.js';

class DonationController extends BaseController {
  create = async (req: Request, res: Response): Promise<void> => {
    const input = req.body as CreateDonationInput;
    const result = await donationService.createCheckout(input);
    this.sendCreated(
      res,
      result,
      'Checkout session created. Redirecting to Stripe…',
    );
  };

  confirm = async (req: Request, res: Response): Promise<void> => {
    const sessionId =
      typeof req.query.session_id === 'string' ? req.query.session_id : undefined;

    if (!sessionId) {
      throw new BadRequestError('session_id is required');
    }

    const donation = await donationService.confirmCheckoutSession(sessionId);
    this.sendSuccess(res, donation, { message: 'Donation confirmed successfully' });
  };

  webhook = async (req: Request, res: Response): Promise<void> => {
    const signature = req.headers['stripe-signature'];
    if (typeof signature !== 'string') {
      throw new BadRequestError('Missing Stripe signature');
    }

    const rawBody = req.body as Buffer;
    if (!Buffer.isBuffer(rawBody)) {
      throw new BadRequestError('Invalid webhook body');
    }

    const result = await donationService.handleStripeWebhook(rawBody, signature);
    res.status(200).json(result);
  };

  list = async (req: Request, res: Response): Promise<void> => {
    const query = req.validatedQuery as DonationListQuery;
    const result = await donationService.list({
      search: query.search,
      status: query.status,
      page: query.page,
      limit: query.limit,
    });

    this.sendPaginated(res, result.data, result.pagination, 'Donations retrieved successfully');
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.validatedParams as { id: string };
    const donation = await donationService.getById(id);
    this.sendSuccess(res, donation, { message: 'Donation retrieved successfully' });
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.validatedParams as { id: string };
    await donationService.remove(id);
    this.sendSuccess(res, null, { message: 'Donation deleted successfully' });
  };

  countPending = async (_req: Request, res: Response): Promise<void> => {
    const count = await donationService.countPending();
    this.sendSuccess(res, { count }, { message: 'Pending donation count retrieved successfully' });
  };

  getRecentPublic = async (_req: Request, res: Response): Promise<void> => {
    const donations = await donationService.getRecentPublic();
    this.sendSuccess(res, donations, { message: 'Recent donations retrieved successfully' });
  };

  getTopDonorsPublic = async (_req: Request, res: Response): Promise<void> => {
    const donors = await donationService.getTopDonorsPublic();
    this.sendSuccess(res, donors, { message: 'Top donors retrieved successfully' });
  };
}

export const donationController = new DonationController();
