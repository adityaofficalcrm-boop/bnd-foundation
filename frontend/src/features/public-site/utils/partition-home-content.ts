import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';

const HOME_SLUG_PREFIXES = ['stat-', 'program-', 'team-', 'gallery-'] as const;

function hasHomePrefix(slug: string): boolean {
  return HOME_SLUG_PREFIXES.some((prefix) => slug.startsWith(prefix));
}

export type HomeContentGroups = {
  hero: CmsPublicPage | null;
  statsHeading: CmsPublicPage | null;
  stats: CmsPublicPage[];
  programsHeading: CmsPublicPage | null;
  programs: CmsPublicPage[];
  teamHeading: CmsPublicPage | null;
  team: CmsPublicPage[];
  galleryHeading: CmsPublicPage | null;
  gallery: CmsPublicPage[];
};

export function partitionHomeContent(entries: CmsPublicPage[]): HomeContentGroups {
  const statsHeading = entries.find((entry) => entry.slug === 'stats-heading') ?? null;
  const programsHeading = entries.find((entry) => entry.slug === 'programs-heading') ?? null;
  const teamHeading = entries.find((entry) => entry.slug === 'team-heading') ?? null;
  const galleryHeading = entries.find((entry) => entry.slug === 'gallery-heading') ?? null;

  const stats = entries.filter((entry) => entry.slug.startsWith('stat-'));
  const programs = entries.filter((entry) => entry.slug.startsWith('program-'));
  const team = entries.filter((entry) => entry.slug.startsWith('team-'));
  const gallery = entries.filter((entry) => entry.slug.startsWith('gallery-'));

  const hero =
    entries.find((entry) => entry.slug === 'hero') ??
    entries.find((entry) => !hasHomePrefix(entry.slug) && !isSectionHeadingSlug(entry.slug)) ??
    null;

  return {
    hero,
    statsHeading,
    stats,
    programsHeading,
    programs,
    teamHeading,
    team,
    galleryHeading,
    gallery,
  };
}

function isSectionHeadingSlug(slug: string): boolean {
  return slug.endsWith('-heading');
}
