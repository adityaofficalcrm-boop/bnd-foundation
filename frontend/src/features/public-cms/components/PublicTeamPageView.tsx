import { useTranslation } from 'react-i18next';
import { NAV_SLUGS } from '@/config/public-nav';
import { TEAM_GROUPS } from '@/features/cms/config/cms-content-types';
import { CMS_SECTIONS } from '@/features/cms/types/cms.types';
import { PublicCmsState } from '@/features/public-cms/components/PublicCmsState';
import { usePublicCmsAll, usePublicCmsSection } from '@/features/public-cms/hooks/usePublicCmsQueries';
import { filterPublicContentEntries } from '@/features/public-cms/utils/cms-entry-filters';
import { usePublicNavLabel } from '@/features/public-cms/hooks/usePublicNavLabel';
import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';
import { AboutDonateCtaBanner } from '@/features/public-site/components/about/AboutDonateCtaBanner';
import { AboutPageHero } from '@/features/public-site/components/about/AboutPageHero';
import { PageContainer } from '@/features/public-site/components/PageContainer';
import { TeamFamilyPhoto } from '@/features/public-site/components/team/TeamFamilyPhoto';
import { TeamMemberGrid } from '@/features/public-site/components/team/TeamMemberGrid';
import { TeamPageIntro } from '@/features/public-site/components/team/TeamPageIntro';
import {
  dedupeTeamMembersForTeamPage,
  findTeamPageIntro,
  getTeamMemberGroup,
  isDenseTeamGroup,
  isTeamMemberSlug,
} from '@/features/public-site/utils/team-content-slugs';

const TEAM_CTA_SLUG = 'team-cta';

function groupTeamMembers(members: CmsPublicPage[]) {
  const groups = new Map<string, CmsPublicPage[]>();

  for (const group of TEAM_GROUPS) {
    groups.set(group.value, []);
  }

  for (const member of members) {
    const key = getTeamMemberGroup(member);
    const list = groups.get(key) ?? [];
    list.push(member);
    groups.set(key, list);
  }

  return TEAM_GROUPS.map((group) => ({
    ...group,
    members: (groups.get(group.value) ?? []).sort((a, b) => a.sortOrder - b.sortOrder),
  })).filter((group) => group.members.length > 0);
}

export function PublicTeamPageView() {
  const { t } = useTranslation();
  const { data: entries = [], isLoading, isError, refetch } = usePublicCmsSection(CMS_SECTIONS.ABOUT_US);
  const { data: allPages = [] } = usePublicCmsAll();

  const contentEntries = filterPublicContentEntries(entries);
  const intro = findTeamPageIntro(contentEntries);
  const members = dedupeTeamMembersForTeamPage(contentEntries.filter((entry) => isTeamMemberSlug(entry.slug)));
  const grouped = groupTeamMembers(members);
  const cta =
    contentEntries.find((entry) => entry.slug === TEAM_CTA_SLUG) ??
    contentEntries.find((entry) => entry.slug === 'about-cta') ??
    null;

  const pageTitle = usePublicNavLabel(allPages, NAV_SLUGS.team, t('fallbacks.ourTeams'));
  const introTitle = intro?.title?.trim() || t('fallbacks.meetTeam');
  const introDescription = intro?.subheading?.trim() || t('fallbacks.teamIntro');
  const familyCaption = intro?.heading?.trim() || t('fallbacks.theFamily');
  const familyImage = intro?.imageUrl ?? null;
  const hasContent = Boolean(intro || members.length > 0 || cta);

  return (
    <>
      <AboutPageHero title={pageTitle} pages={allPages} currentLabel={pageTitle} />

      <PublicCmsState
        isLoading={isLoading}
        isError={isError}
        isEmpty={!hasContent}
        onRetry={() => void refetch()}
        emptyDescription="Publish CMS entries with slug team-page and team-* profiles to build this page."
      >
        <PageContainer className="space-y-14 py-10 md:space-y-16 md:py-14">
          {familyImage ? <TeamFamilyPhoto imageUrl={familyImage} caption={familyCaption} /> : null}

          <TeamPageIntro title={introTitle} description={introDescription} body={intro?.body} />

          {grouped.map((group) => (
            <TeamMemberGrid
              key={group.value}
              title={t(`teamGroups.${group.value}`)}
              members={group.members}
              columns={isDenseTeamGroup(group.value) ? 6 : 4}
            />
          ))}

          <AboutDonateCtaBanner entry={cta} />
        </PageContainer>
      </PublicCmsState>
    </>
  );
}
