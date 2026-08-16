import { z } from 'zod';
import { CAMPAIGN_STATUSES } from '@/features/campaign/types/campaign.types';

export const campaignFormSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters'),
  slug: z.string().trim().max(200).optional().or(z.literal('')),
  description: z.string().trim().min(10, 'Description must be at least 10 characters'),
  goalAmount: z.number().positive('Goal must be greater than 0'),
  raisedAmount: z.number().min(0).optional(),
  coverImageUrl: z.string().trim().optional().or(z.literal('')),
  status: z.enum([
    CAMPAIGN_STATUSES.DRAFT,
    CAMPAIGN_STATUSES.ACTIVE,
    CAMPAIGN_STATUSES.COMPLETED,
  ]),
  startDate: z.string().optional().or(z.literal('')),
  endDate: z.string().optional().or(z.literal('')),
  sortOrder: z.number().int().optional(),
});

export type CampaignFormValues = z.infer<typeof campaignFormSchema>;
