import { CMS_SECTIONS, type CmsSection } from '@/features/cms/types/cms.types';

export type PublicNavItem = {
  path: string;
  section: CmsSection;
};

export const PUBLIC_NAV_ITEMS: PublicNavItem[] = [
  { path: '/', section: CMS_SECTIONS.HOME },
  { path: '/about', section: CMS_SECTIONS.ABOUT_US },
  { path: '/mission', section: CMS_SECTIONS.MISSION_VISION },
  { path: '/contact', section: CMS_SECTIONS.CONTACT_INFO },
];

export function formatPathLabel(path: string): string {
  const segment = path === '/' ? 'home' : path.replace(/^\//, '');
  return segment
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
