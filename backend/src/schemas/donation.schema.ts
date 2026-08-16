import { z } from 'zod';
import {
  DONATION_STATUS_VALUES,
  MAX_DONATION_AMOUNT_CENTS,
  MIN_DONATION_AMOUNT_CENTS,
} from '../constants/donation.js';
import { objectIdSchema, paginationQuerySchema } from '../utils/validation.js';

const minDonationDollars = MIN_DONATION_AMOUNT_CENTS / 100;
const maxDonationDollars = MAX_DONATION_AMOUNT_CENTS / 100;

export const createDonationSchema = z.object({
  donorName: z.string().trim().min(2, 'Name must be at least 2 characters').max(200),
  email: z.string().trim().email('Enter a valid email address').max(320),
  phone: z.string().trim().min(6, 'Enter a valid phone number').max(50).optional().or(z.literal('')),
  country: z.string().trim().max(100).optional().or(z.literal('')),
  amount: z
    .coerce
    .number()
    .min(minDonationDollars, `Minimum donation is $${minDonationDollars}`)
    .max(maxDonationDollars, `Maximum donation is $${maxDonationDollars.toLocaleString()}`),
  campaignSlug: z.string().trim().max(200).optional().or(z.literal('')),
  recaptchaToken: z.string().optional(),
});

export type CreateDonationInput = z.infer<typeof createDonationSchema>;

export const donationListQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().max(200).optional(),
  status: z.enum(DONATION_STATUS_VALUES).optional(),
});

export type DonationListQuery = z.infer<typeof donationListQuerySchema>;

export const donationIdParamSchema = z.object({
  id: objectIdSchema,
});
