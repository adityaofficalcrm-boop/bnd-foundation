import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';
import { filterPublicContentEntries } from '@/features/public-cms/utils/cms-entry-filters';

/** Full mission/vision rows on /about — excluded from the homepage Mission & Vision section. */
export const ABOUT_MISSION_VISION_SLUGS = new Set(['mission', 'vision']);

export function isAboutMissionVisionSlug(slug: string): boolean {
  return ABOUT_MISSION_VISION_SLUGS.has(slug);
}

export function filterHomeMissionVisionEntries<T extends Pick<CmsPublicPage, 'slug'>>(entries: T[]): T[] {
  return filterPublicContentEntries(entries).filter((entry) => !isAboutMissionVisionSlug(entry.slug));
}
