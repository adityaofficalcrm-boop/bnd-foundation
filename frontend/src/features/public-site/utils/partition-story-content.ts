import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';
import { filterPublicContentEntries } from '@/features/public-cms/utils/cms-entry-filters';

export type StoryPageContent = {
  intro: CmsPublicPage | null;
  sections: CmsPublicPage[];
  cta: CmsPublicPage | null;
};

export function partitionStoryContent(
  entries: CmsPublicPage[],
  introSlug: string,
  sectionPrefix: string,
  ctaSlug: string,
  reservedSectionSlugs: string[] = [],
): StoryPageContent {
  const contentEntries = filterPublicContentEntries(entries);

  const intro = contentEntries.find((entry) => entry.slug === introSlug) ?? null;

  const sectionEntries = contentEntries
    .filter((entry) => entry.slug.startsWith(sectionPrefix))
    .sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));

  const reserved = new Set([ctaSlug, ...reservedSectionSlugs]);
  const cta = sectionEntries.find((entry) => entry.slug === ctaSlug) ?? null;
  const sections = sectionEntries.filter((entry) => !reserved.has(entry.slug));

  return { intro, sections, cta };
}
