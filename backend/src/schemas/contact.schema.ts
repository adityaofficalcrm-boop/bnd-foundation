import { z } from 'zod';
import { CONTACT_SUBMISSION_STATUS_VALUES } from '../constants/contact.js';
import { paginationQuerySchema, objectIdSchema } from '../utils/validation.js';

export const createContactSubmissionSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(200),
  email: z.string().trim().email('Enter a valid email address').max(320),
  phone: z.string().trim().min(6, 'Enter a valid phone number').max(50),
  company: z.string().trim().max(200).optional().or(z.literal('')),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(5000),
  recaptchaToken: z.string().optional(),
});

export type CreateContactSubmissionInput = z.infer<typeof createContactSubmissionSchema>;

export const contactSubmissionListQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().max(200).optional(),
  status: z.enum(CONTACT_SUBMISSION_STATUS_VALUES).optional(),
});

export type ContactSubmissionListQuery = z.infer<typeof contactSubmissionListQuerySchema>;

export const contactSubmissionIdParamSchema = z.object({
  id: objectIdSchema,
});
