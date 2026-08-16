import { z } from 'zod';
import { MAX_DONATION_AMOUNT, MIN_DONATION_AMOUNT } from '@/features/donation/types/donation.types';

export const donateAmountSchema = z.object({
  amount: z
    .number()
    .min(MIN_DONATION_AMOUNT, `Minimum donation is $${MIN_DONATION_AMOUNT}`)
    .max(MAX_DONATION_AMOUNT, `Maximum donation is $${MAX_DONATION_AMOUNT.toLocaleString()}`),
});

export const donateDonorSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().max(100).optional().or(z.literal('')),
  email: z.string().trim().email('Enter a valid email address'),
});

export const donateFormSchema = donateAmountSchema.merge(donateDonorSchema);

export type DonateFormValues = z.infer<typeof donateFormSchema>;

export type SubmitDonationPayload = {
  donorName: string;
  email: string;
  amount: number;
  campaignSlug?: string;
  recaptchaToken?: string;
};
