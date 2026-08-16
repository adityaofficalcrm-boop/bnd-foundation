import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z.string().trim().min(6, 'Enter a valid phone number'),
  company: z.string().trim().max(200).optional().or(z.literal('')),
  message: z.string().trim().min(10, 'Message must be at least 10 characters'),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export type SubmitContactPayload = ContactFormValues & {
  recaptchaToken?: string;
};
