import type { DonationStatus } from '../constants/donation.js';
import type { IDonation } from '../models/Donation.model.js';

export type DonationResponse = {
  id: string;
  donorName: string;
  email: string;
  phone?: string;
  country?: string;
  amountCents: number;
  currency: string;
  campaignId?: string;
  status: DonationStatus;
  stripeCheckoutSessionId?: string;
  stripePaymentIntentId?: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
};

export type PublicDonationSummary = {
  id: string;
  donorName: string;
  amountCents: number;
  currency: string;
  createdAt: string;
};

export type TopDonorSummary = {
  donorName: string;
  email: string;
  totalAmountCents: number;
  donationCount: number;
};

export function toPublicDonationSummary(donation: IDonation): PublicDonationSummary {
  return {
    id: donation.id,
    donorName: donation.donorName,
    amountCents: donation.amountCents,
    currency: donation.currency,
    createdAt: donation.createdAt.toISOString(),
  };
}

export function toDonationResponse(donation: IDonation): DonationResponse {
  return {
    id: donation.id,
    donorName: donation.donorName,
    email: donation.email,
    phone: donation.phone || undefined,
    country: donation.country || undefined,
    amountCents: donation.amountCents,
    currency: donation.currency,
    campaignId: donation.campaignId?.toString(),
    status: donation.status,
    stripeCheckoutSessionId: donation.stripeCheckoutSessionId || undefined,
    stripePaymentIntentId: donation.stripePaymentIntentId || undefined,
    transactionId: donation.transactionId || undefined,
    createdAt: donation.createdAt.toISOString(),
    updatedAt: donation.updatedAt.toISOString(),
  };
}
