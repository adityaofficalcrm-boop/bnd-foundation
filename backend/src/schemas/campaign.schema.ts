import { z } from 'zod';
import { CAMPAIGN_STATUS_VALUES } from '../constants/campaign.js';
import { objectIdSchema, paginationQuerySchema } from '../utils/validation.js';

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 200);
}

const optionalDate = z
  .string()
  .trim()
  .optional()
  .or(z.literal(''))
  .transform((value) => (value === undefined || value === '' ? null : value));

export const createCampaignSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters').max(200),
  slug: z
    .string()
    .trim()
    .max(200)
    .optional()
    .or(z.literal(''))
    .transform((value) => (value ? slugify(value) : undefined)),
  description: z.string().trim().min(10, 'Description must be at least 10 characters').max(10000),
  goalAmount: z.coerce.number().positive('Goal amount must be greater than 0').max(10_000_000),
  raisedAmount: z.coerce.number().min(0).max(10_000_000).optional().default(0),
  coverImageUrl: z.string().trim().max(1000).optional().or(z.literal('')),
  status: z.enum(CAMPAIGN_STATUS_VALUES).default('DRAFT'),
  startDate: optionalDate,
  endDate: optionalDate,
  sortOrder: z.coerce.number().int().optional().default(0),
});

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;

export const updateCampaignSchema = createCampaignSchema.partial();

export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;

export const campaignListQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().max(200).optional(),
  status: z.enum(CAMPAIGN_STATUS_VALUES).optional(),
});

export type CampaignListQuery = z.infer<typeof campaignListQuerySchema>;

export const campaignIdParamSchema = z.object({
  id: objectIdSchema,
});

export const campaignSlugParamSchema = z.object({
  slug: z.string().trim().min(1).max(200),
});
