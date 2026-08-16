export const CMS_SECTIONS = {
  HOME: 'HOME',
  ABOUT_US: 'ABOUT_US',
  MISSION_VISION: 'MISSION_VISION',
  CONTACT_INFO: 'CONTACT_INFO',
  FOOTER: 'FOOTER',
} as const;

export type CmsSection = (typeof CMS_SECTIONS)[keyof typeof CMS_SECTIONS];

export const CMS_SECTION_LABELS: Record<CmsSection, string> = {
  HOME: 'Home Page',
  ABOUT_US: 'About Us',
  MISSION_VISION: 'Mission & Vision',
  CONTACT_INFO: 'Contact Information',
  FOOTER: 'Footer Settings',
};

export const CMS_STATUSES = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
} as const;

export type CmsStatus = (typeof CMS_STATUSES)[keyof typeof CMS_STATUSES];

export const CMS_STATUS_LABELS: Record<CmsStatus, string> = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
};

export interface CmsMeta {
  email?: string;
  phone?: string;
  address?: string;
  copyright?: string;
  socialFacebook?: string;
  socialTwitter?: string;
  socialInstagram?: string;
  socialLinkedin?: string;
  socialYoutube?: string;
  supportCredit?: string;
  role?: string;
  group?: string;
  amount?: string;
  location?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  grantProvider?: string;
}

export interface CmsPage {
  id: string;
  section: CmsSection;
  title: string;
  slug: string;
  heading?: string;
  subheading?: string;
  body: string;
  imageUrl?: string;
  meta?: CmsMeta;
  status: CmsStatus;
  sortOrder: number;
  createdBy: string;
  updatedBy: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CmsListParams {
  page?: number;
  limit?: number;
  search?: string;
  section?: CmsSection;
  status?: CmsStatus;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  meta?: {
    pagination?: PaginationMeta;
  };
}

export interface CreateCmsPayload {
  section: CmsSection;
  title: string;
  slug: string;
  heading?: string | null;
  subheading?: string | null;
  body: string;
  imageUrl?: string | null;
  meta?: CmsMeta;
  status: CmsStatus;
  sortOrder: number;
}

export type UpdateCmsPayload = Partial<CreateCmsPayload>;
