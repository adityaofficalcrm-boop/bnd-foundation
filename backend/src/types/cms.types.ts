import type { ICmsMeta, ICmsPage } from '../models/CmsPage.model.js';

export type CmsPageResponse = {
  id: string;
  section: ICmsPage['section'];
  title: string;
  slug: string;
  heading?: string;
  subheading?: string;
  body: string;
  imageUrl?: string;
  meta?: ICmsMeta;
  status: ICmsPage['status'];
  sortOrder: number;
  createdBy: string;
  updatedBy: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CmsPublicPageResponse = Omit<CmsPageResponse, 'createdBy' | 'updatedBy' | 'status'>;

export function toCmsPageResponse(page: ICmsPage): CmsPageResponse {
  return {
    id: page._id.toString(),
    section: page.section,
    title: page.title,
    slug: page.slug,
    heading: page.heading,
    subheading: page.subheading,
    body: page.body,
    imageUrl: page.imageUrl || undefined,
    meta: page.meta,
    status: page.status,
    sortOrder: page.sortOrder,
    createdBy: page.createdBy.toString(),
    updatedBy: page.updatedBy.toString(),
    publishedAt: page.publishedAt ? page.publishedAt.toISOString() : null,
    createdAt: page.createdAt.toISOString(),
    updatedAt: page.updatedAt.toISOString(),
  };
}

export function toCmsPublicPageResponse(page: ICmsPage): CmsPublicPageResponse {
  const response = toCmsPageResponse(page);

  return {
    id: response.id,
    section: response.section,
    title: response.title,
    slug: response.slug,
    heading: response.heading,
    subheading: response.subheading,
    body: response.body,
    imageUrl: response.imageUrl,
    meta: response.meta,
    sortOrder: response.sortOrder,
    publishedAt: response.publishedAt,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  };
}

export function sanitizeCmsMeta(meta?: ICmsMeta): ICmsMeta | undefined {
  if (!meta) {
    return undefined;
  }

  const cleaned = Object.fromEntries(
    Object.entries(meta).filter(([, value]) => value !== undefined && value !== ''),
  ) as ICmsMeta;

  return Object.keys(cleaned).length > 0 ? cleaned : undefined;
}
