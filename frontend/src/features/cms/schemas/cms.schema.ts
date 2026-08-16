import { z } from 'zod';
import {
  CMS_SECTIONS,
  CMS_STATUSES,
  type CreateCmsPayload,
  type CmsPage,
  type UpdateCmsPayload,
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
  socialYoutube: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  supportCredit: z.string().max(200).optional(),
  role: z.string().max(120).optional(),
  group: z.string().max(80).optional(),
  amount: z.string().max(50).optional(),
  location: z.string().max(200).optional(),
  ctaLabel: z.string().max(120).optional(),
  ctaUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  grantProvider: z.string().max(200).optional(),
});

const optionalText = (max: number) => z.union([z.string().max(max), z.literal('')]).optional();

export const cmsFormSchema = z.object({
  section: z.enum(cmsSectionValues),
  title: z.string().min(2, 'Title must be at least 2 characters').max(200),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens only'),
  heading: optionalText(300),
  subheading: optionalText(500),
  body: z.string().min(1, 'Body content is required'),
  imageUrl: z.union([z.literal(''), z.string().url('Enter a valid image URL')]).optional(),
  meta: cmsMetaSchema.optional(),
  status: z.enum(cmsStatusValues),
  sortOrder: z.number().int('Sort order must be a whole number').min(0, 'Sort order must be 0 or greater'),
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

function trimOrNull(value?: string): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function toCmsPayload(values: CmsFormValues): CreateCmsPayload {
  return {
    section: values.section,
    title: values.title.trim(),
    slug: values.slug,
    body: values.body,
    status: values.status,
    sortOrder: values.sortOrder,
    imageUrl: values.imageUrl?.trim() || undefined,
    heading: values.heading?.trim() || undefined,
    subheading: values.subheading?.trim() || undefined,
    meta: values.meta,
  };
}

/** Update payloads always include nullable optional text fields so cleared values persist. */
export function toCmsUpdatePayload(values: CmsFormValues): UpdateCmsPayload {
  return {
    section: values.section,
    title: values.title.trim(),
    slug: values.slug,
    body: values.body,
    status: values.status,
    sortOrder: values.sortOrder,
    imageUrl: trimOrNull(values.imageUrl),
    heading: trimOrNull(values.heading),
    subheading: trimOrNull(values.subheading),
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
