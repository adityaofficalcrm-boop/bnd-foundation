import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';
import { isNavSlug } from '@/features/public-cms/utils/cms-entry-filters';

const HOME_RESERVED_SLUGS = new Set(['donate-banner', 'facebook-updates']);

const HOME_SLUG_PREFIXES = [
  'stat-',
  'org-stat-',
  'program-',
  'cta-',
  'testimonial-',
  'partner-',
  'fundraise-',
  'donate-slide-',
] as const;

function hasHomePrefix(slug: string): boolean {
  return HOME_SLUG_PREFIXES.some((prefix) => slug.startsWith(prefix));
}

export type HomeContentGroups = {
  hero: CmsPublicPage | null;
  statsHeading: CmsPublicPage | null;
  stats: CmsPublicPage[];
  programsHeading: CmsPublicPage | null;
  programs: CmsPublicPage[];
  testimonialsHeading: CmsPublicPage | null;
  testimonials: CmsPublicPage[];
  partnersHeading: CmsPublicPage | null;
  partners: CmsPublicPage[];
  orgStats: CmsPublicPage[];
  fundraiseHeading: CmsPublicPage | null;
  fundraise: CmsPublicPage[];
  ctaHeading: CmsPublicPage | null;
  ctas: CmsPublicPage[];
  donateSlides: CmsPublicPage[];
  facebookUpdates: CmsPublicPage | null;
};

export function partitionHomeContent(entries: CmsPublicPage[]): HomeContentGroups {
  const statsHeading = entries.find((entry) => entry.slug === 'stats-heading') ?? null;
  const programsHeading = entries.find((entry) => entry.slug === 'programs-heading') ?? null;
  const testimonialsHeading = entries.find((entry) => entry.slug === 'testimonials-heading') ?? null;
  const partnersHeading = entries.find((entry) => entry.slug === 'partners-heading') ?? null;
  const fundraiseHeading = entries.find((entry) => entry.slug === 'fundraise-heading') ?? null;
  const ctaHeading = entries.find((entry) => entry.slug === 'cta-heading') ?? null;
  const facebookUpdates = entries.find((entry) => entry.slug === 'facebook-updates') ?? null;

  const donateSlides = entries
    .filter((entry) => entry.slug.startsWith('donate-slide-') || entry.slug === 'donate-banner')
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const stats = entries.filter((entry) => entry.slug.startsWith('stat-'));
  const programs = entries.filter((entry) => entry.slug.startsWith('program-'));
  const testimonials = entries.filter((entry) => entry.slug.startsWith('testimonial-'));
  const partners = entries.filter((entry) => entry.slug.startsWith('partner-'));
  const orgStats = entries.filter((entry) => entry.slug.startsWith('org-stat-'));
  const fundraise = entries.filter((entry) => entry.slug.startsWith('fundraise-'));
  const ctas = entries.filter((entry) => entry.slug.startsWith('cta-') && entry.slug !== 'cta-heading');

  const hero =
    entries.find((entry) => entry.slug === 'hero') ??
    entries.find(
      (entry) =>
        !isNavSlug(entry.slug) &&
        !hasHomePrefix(entry.slug) &&
        !isSectionHeadingSlug(entry.slug) &&
        !HOME_RESERVED_SLUGS.has(entry.slug),
    ) ??
    null;

  return {
    hero,
    statsHeading,
    stats,
    programsHeading,
    programs,
    testimonialsHeading,
    testimonials,
    partnersHeading,
    partners,
    orgStats,
    fundraiseHeading,
    fundraise,
    ctaHeading,
    ctas,
    donateSlides,
    facebookUpdates,
  };
}

function isSectionHeadingSlug(slug: string): boolean {
  return slug.endsWith('-heading');
}
