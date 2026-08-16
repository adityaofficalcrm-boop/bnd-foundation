import { filterPublicContentEntries } from '@/features/public-cms/utils/cms-entry-filters';
import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';

/** Slugs with dedicated layout blocks on /about — excluded from generic about-* rows. */
export const ABOUT_LANDING_RESERVED_SLUGS = new Set([
  'about-hero',
  'about-journey-resilience',
  'about-journey-portrait-right',
  'about-journey-signature',
  'about-cta',
]);

/** About Us CMS slugs used only on /about — never on the homepage. */
export const ABOUT_PAGE_ONLY_SLUGS = new Set(['about', ...ABOUT_LANDING_RESERVED_SLUGS]);

export function isAboutLandingOnlySlug(slug: string): boolean {
  return ABOUT_LANDING_RESERVED_SLUGS.has(slug);
}

export function isAboutPageOnlySlug(slug: string): boolean {
  return ABOUT_PAGE_ONLY_SLUGS.has(slug);
}

export function filterHomeAboutEntries<T extends Pick<CmsPublicPage, 'slug'>>(entries: T[]): T[] {
  return filterPublicContentEntries(entries).filter(
    (entry) => !isAboutPageOnlySlug(entry.slug),
  );
}

export type AboutLandingContent = {
  intro: CmsPublicPage | null;
  hero: CmsPublicPage | null;
  journey: CmsPublicPage | null;
  journeyPortraitRight: CmsPublicPage | null;
  journeySignature: CmsPublicPage | null;
  cta: CmsPublicPage | null;
  sections: CmsPublicPage[];
};

export function partitionAboutLandingContent(entries: CmsPublicPage[]): AboutLandingContent {
  const contentEntries = filterPublicContentEntries(entries);

  const intro = contentEntries.find((entry) => entry.slug === 'about') ?? null;
  const hero = contentEntries.find((entry) => entry.slug === 'about-hero') ?? null;
  const journey = contentEntries.find((entry) => entry.slug === 'about-journey-resilience') ?? null;
  const journeyPortraitRight =
    contentEntries.find((entry) => entry.slug === 'about-journey-portrait-right') ?? null;
  const journeySignature = contentEntries.find((entry) => entry.slug === 'about-journey-signature') ?? null;
  const cta = contentEntries.find((entry) => entry.slug === 'about-cta') ?? null;

  const sections = contentEntries
    .filter(
      (entry) =>
        entry.slug.startsWith('about-') &&
        entry.slug !== 'about' &&
        !ABOUT_LANDING_RESERVED_SLUGS.has(entry.slug),
    )
    .sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));

  return { intro, hero, journey, journeyPortraitRight, journeySignature, cta, sections };
}
