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

export const CMS_SECTION_VALUES = Object.values(CMS_SECTIONS);
export const CMS_STATUS_VALUES = Object.values(CMS_STATUSES);
