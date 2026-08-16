import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';

export const NAV_SLUG_PREFIX = 'nav-';

export function isNavSlug(slug: string): boolean {
  return slug.startsWith(NAV_SLUG_PREFIX);
}

export function isNavEntry(entry: Pick<CmsPublicPage, 'slug'>): boolean {
  return isNavSlug(entry.slug);
}

/** CMS entries used only for navigation labels — never rendered as page content. */
export function filterPublicContentEntries<T extends Pick<CmsPublicPage, 'slug'>>(entries: T[]): T[] {
  return entries.filter((entry) => !isNavEntry(entry));
}

export function getNavLabelFromCms(
  pages: Array<Pick<CmsPublicPage, 'slug' | 'title'>>,
  navSlug: string,
  fallback: string,
): string {
  return pages.find((page) => page.slug === navSlug)?.title ?? fallback;
}
