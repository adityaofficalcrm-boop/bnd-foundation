import type { CmsMeta, CmsSection } from '@/features/cms/types/cms.types';

export interface CmsPublicPage {
  id: string;
  section: CmsSection;
  title: string;
  slug: string;
  heading?: string;
  subheading?: string;
  body: string;
  imageUrl?: string;
  meta?: CmsMeta;
  sortOrder: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PublicApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}
