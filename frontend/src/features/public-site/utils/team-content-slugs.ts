import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';

/** About Us CMS slugs for team content — not individual member profiles. */
export const TEAM_RESERVED_SLUGS = new Set(['team-page', 'team-cta']);

export const ABOUT_BOARD_INTRO_SLUG = 'about-team';
export const ABOUT_BOARD_INTRO_FALLBACK_SLUG = 'team';
export const TEAM_PAGE_INTRO_SLUG = 'team-page';

export function isTeamMemberSlug(slug: string): boolean {
  return slug.startsWith('team-') && !TEAM_RESERVED_SLUGS.has(slug);
}

export function getTeamMemberGroup(entry: Pick<CmsPublicPage, 'meta'>): string {
  return entry.meta?.group ?? 'board';
}

function normalizeTeamMemberTitle(title: string): string {
  return title.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * On /team, the same person may appear in multiple sections (e.g. Advisors + Nepal Chapter).
 * Only drop Board duplicates when a non-board entry exists for that name.
 */
export function dedupeTeamMembersForTeamPage(members: CmsPublicPage[]): CmsPublicPage[] {
  const byTitle = new Map<string, CmsPublicPage[]>();

  for (const member of members) {
    const key = normalizeTeamMemberTitle(member.title);
    const list = byTitle.get(key) ?? [];
    list.push(member);
    byTitle.set(key, list);
  }

  const result: CmsPublicPage[] = [];

  for (const candidates of byTitle.values()) {
    if (candidates.length === 1) {
      result.push(candidates[0]);
      continue;
    }

    const nonBoard = candidates.filter((member) => getTeamMemberGroup(member) !== 'board');

    if (nonBoard.length > 0) {
      const seenGroups = new Set<string>();

      for (const entry of [...nonBoard].sort((a, b) => a.sortOrder - b.sortOrder)) {
        const group = getTeamMemberGroup(entry);
        if (seenGroups.has(group)) {
          continue;
        }

        seenGroups.add(group);
        result.push(entry);
      }

      continue;
    }

    const [bestBoardEntry] = [...candidates].sort((a, b) => a.sortOrder - b.sortOrder);
    result.push(bestBoardEntry);
  }

  return result;
}

export function isDenseTeamGroup(groupValue: string): boolean {
  return groupValue === 'management' || groupValue === 'nepal-chapter';
}

export function isAboutBoardMember(entry: Pick<CmsPublicPage, 'slug' | 'meta'>): boolean {
  return isTeamMemberSlug(entry.slug) && getTeamMemberGroup(entry) === 'board';
}

export function findAboutBoardIntro(entries: CmsPublicPage[]): CmsPublicPage | null {
  return (
    entries.find((entry) => entry.slug === ABOUT_BOARD_INTRO_SLUG) ??
    entries.find((entry) => entry.slug === ABOUT_BOARD_INTRO_FALLBACK_SLUG) ??
    null
  );
}

export function findTeamPageIntro(entries: CmsPublicPage[]): CmsPublicPage | null {
  return entries.find((entry) => entry.slug === TEAM_PAGE_INTRO_SLUG) ?? null;
}

export function isPlaceholderCmsBody(body?: string | null): boolean {
  const trimmed = body?.trim();
  return !trimmed || trimmed === '.';
}

export function hasMeaningfulCmsBody(body?: string | null): boolean {
  return !isPlaceholderCmsBody(body);
}

const BOARD_SECTION_DEFAULT_TITLE = 'Meet Our Board Members';

export function resolveTeamPageHeroTitle(
  teamPageIntro: CmsPublicPage | null,
  boardIntro: CmsPublicPage | null,
  pageTitle: string,
): string {
  if (!teamPageIntro?.title?.trim()) {
    return pageTitle;
  }

  const teamTitle = teamPageIntro.title.trim();
  const boardTitle = boardIntro?.title?.trim();

  if (
    teamTitle === BOARD_SECTION_DEFAULT_TITLE ||
    (boardTitle && teamTitle === boardTitle)
  ) {
    return pageTitle;
  }

  return teamTitle;
}
