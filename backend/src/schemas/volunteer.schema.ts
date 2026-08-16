import { z } from 'zod';
import { VOLUNTEER_APPLICATION_STATUS_VALUES } from '../constants/volunteer.js';
import { objectIdSchema, paginationQuerySchema } from '../utils/validation.js';

export const createVolunteerApplicationSchema = z.object({
  fullName: z.string().trim().min(2, 'Name must be at least 2 characters').max(200),
  email: z.string().trim().email('Enter a valid email address').max(320),
  phone: z.string().trim().min(6, 'Enter a valid phone number').max(50),
  city: z.string().trim().max(120).optional().or(z.literal('')),
  country: z.string().trim().max(100).optional().or(z.literal('')),
  interests: z.string().trim().min(2, 'Please share what you are interested in').max(500),
  availability: z.string().trim().max(500).optional().or(z.literal('')),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(5000),
});

export type CreateVolunteerApplicationInput = z.infer<typeof createVolunteerApplicationSchema>;

export const volunteerApplicationListQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().max(200).optional(),
  status: z.enum(VOLUNTEER_APPLICATION_STATUS_VALUES).optional(),
});

export type VolunteerApplicationListQuery = z.infer<typeof volunteerApplicationListQuerySchema>;

export const volunteerApplicationIdParamSchema = z.object({
  id: objectIdSchema,
});
