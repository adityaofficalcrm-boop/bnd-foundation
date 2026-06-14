import { z } from 'zod';
import {
  CMS_SECTIONS,
  CMS_STATUSES,
  type CreateCmsPayload,
  type CmsPage,
} from '@/features/cms/types/cms.types';

const cmsSectionValues = [
  CMS_SECTIONS.HOME,
  CMS_SECTIONS.ABOUT_US,
  CMS_SECTIONS.MISSION_VISION,
  CMS_SECTIONS.CONTACT_INFO,
  CMS_SECTIONS.FOOTER,
] as const;

const cmsStatusValues = [CMS_STATUSES.DRAFT, CMS_STATUSES.PUBLISHED] as const;

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

export const cmsFormSchema = z.object({
  section: z.enum(cmsSectionValues),
  title: z.string().min(2, 'Title must be at least 2 characters').max(200),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens only'),
  heading: z.string().max(300).optional(),
  subheading: z.string().max(500).optional(),
  body: z.string().min(1, 'Body content is required'),
  imageUrl: z.string().url('Enter a valid image URL').optional().or(z.literal('')),
  meta: cmsMetaSchema.optional(),
  status: z.enum(cmsStatusValues),
  sortOrder: z.number().int().min(0),
});

export type CmsFormValues = z.infer<typeof cmsFormSchema>;

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function toCmsPayload(values: CmsFormValues): CreateCmsPayload {
  return {
    section: values.section,
    title: values.title,
    slug: values.slug,
    body: values.body,
    status: values.status,
    sortOrder: values.sortOrder,
    imageUrl: values.imageUrl || undefined,
    heading: values.heading || undefined,
    subheading: values.subheading || undefined,
    meta: values.meta,
  };
}

export function cmsPageToFormValues(page: CmsPage): CmsFormValues {
  return {
    section: page.section,
    title: page.title,
    slug: page.slug,
    heading: page.heading ?? '',
    subheading: page.subheading ?? '',
    body: page.body,
    imageUrl: page.imageUrl ?? '',
    status: page.status,
    sortOrder: page.sortOrder,
    meta: page.meta ?? {},
  };
}
