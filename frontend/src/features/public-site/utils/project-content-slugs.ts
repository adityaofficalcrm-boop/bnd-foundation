/** CMS slugs for /projects page structure — not featured project profiles. */
export const PROJECTS_HERO_SLUG = 'projects-hero';
export const PROJECTS_INTRO_SLUG = 'projects';
export const PROJECTS_GRANTS_HEADING_SLUG = 'projects-grants-heading';
export const PROJECTS_CTA_SLUG = 'projects-cta';

const PROJECTS_RESERVED_SLUGS = new Set([
  PROJECTS_HERO_SLUG,
  PROJECTS_INTRO_SLUG,
  PROJECTS_GRANTS_HEADING_SLUG,
  PROJECTS_CTA_SLUG,
]);

export function isFeaturedProjectSlug(slug: string): boolean {
  return slug.startsWith('project-') && !PROJECTS_RESERVED_SLUGS.has(slug);
}

export function isGrantCardSlug(slug: string): boolean {
  return slug.startsWith('grant-');
}
