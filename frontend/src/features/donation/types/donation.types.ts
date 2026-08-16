export const DONATION_STATUSES = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
  CANCELLED: 'CANCELLED',
} as const;

export type DonationStatus = (typeof DONATION_STATUSES)[keyof typeof DONATION_STATUSES];

export const DONATION_STATUS_LABELS: Record<DonationStatus, string> = {
  PENDING: 'Pending',
  PAID: 'Paid',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
  CANCELLED: 'Cancelled',
};

export const DONATION_PRESET_AMOUNTS = [10, 25, 50, 100, 250, 500] as const;

export const MIN_DONATION_AMOUNT = 2;
export const MAX_DONATION_AMOUNT = 10_000;

export type Donation = {
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

export type DonationListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: DonationStatus;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
  meta?: {
    pagination?: PaginationMeta;
  };
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
