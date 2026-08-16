import { z } from 'zod';

export const volunteerFormSchema = z.object({
  fullName: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z.string().trim().min(6, 'Enter a valid phone number'),
  city: z.string().trim().max(120).optional().or(z.literal('')),
  country: z.string().trim().max(100).optional().or(z.literal('')),
  interests: z.string().trim().min(2, 'Please select or describe your interests'),
  availability: z.string().trim().max(500).optional().or(z.literal('')),
  message: z.string().trim().min(10, 'Please tell us a bit more (at least 10 characters)'),
});

export type VolunteerFormValues = z.infer<typeof volunteerFormSchema>;

export type SubmitVolunteerPayload = VolunteerFormValues;
