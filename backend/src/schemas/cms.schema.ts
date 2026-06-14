import { z } from 'zod';
import { CMS_SECTION_VALUES, CMS_STATUS_VALUES } from '../constants/cms.js';
import { paginationQuerySchema } from '../utils/validation.js';

export const cmsMetaSchema = z.object({
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  phone: z.string().max(50).optional(),
  address: z.string().max(500).optional(),
  copyright: z.string().max(300).optional(),
  socialFacebook: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  socialTwitter: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  socialInstagram: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  socialLinkedin: z.string().url('Enter a valid URL').optional().or(z.literal('')),
});

export const createCmsSchema = z.object({
  section: z.enum(CMS_SECTION_VALUES),
  title: z.string().min(2, 'Title must be at least 2 characters').max(200),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase letters, numbers, and hyphens'),
  heading: z.string().max(300).optional(),
  subheading: z.string().max(500).optional(),
  body: z.string().min(1, 'Body content is required'),
  imageUrl: z.string().url('Enter a valid image URL').optional().or(z.literal('')),
  meta: cmsMetaSchema.optional(),
  status: z.enum(CMS_STATUS_VALUES).default('DRAFT'),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export const updateCmsSchema = createCmsSchema.partial();

export const cmsListQuerySchema = paginationQuerySchema.extend({
  search: z.string().optional(),
  section: z.enum(CMS_SECTION_VALUES).optional(),
  status: z.enum(CMS_STATUS_VALUES).optional(),
});

export const cmsIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid CMS page ID'),
});

export const cmsPublicSectionParamSchema = z.object({
  section: z.enum(CMS_SECTION_VALUES),
});

export type CreateCmsInput = z.infer<typeof createCmsSchema>;
export type UpdateCmsInput = z.infer<typeof updateCmsSchema>;
export type CmsListQuery = z.infer<typeof cmsListQuerySchema>;
export type CmsPublicSectionParam = z.infer<typeof cmsPublicSectionParamSchema>;
