export const DONATION_STATUSES = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
  CANCELLED: 'CANCELLED',
} as const;

export type DonationStatus = (typeof DONATION_STATUSES)[keyof typeof DONATION_STATUSES];

export const DONATION_STATUS_VALUES = Object.values(DONATION_STATUSES);

export const DEFAULT_DONATION_CURRENCY = 'aud';

/** Minimum donation in cents — $2 AUD (tax deductible threshold). */
export const MIN_DONATION_AMOUNT_CENTS = 200;

/** Maximum donation in cents — $10,000 AUD per transaction. */
export const MAX_DONATION_AMOUNT_CENTS = 1_000_000;
