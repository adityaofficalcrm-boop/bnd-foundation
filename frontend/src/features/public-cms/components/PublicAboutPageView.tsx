import { useTranslation } from 'react-i18next';
import { NAV_SLUGS } from '@/config/public-nav';
import { CMS_SECTIONS } from '@/features/cms/types/cms.types';
import { PublicCmsState } from '@/features/public-cms/components/PublicCmsState';
import { filterPublicContentEntries } from '@/features/public-cms/utils/cms-entry-filters';
import { usePublicCmsAll, usePublicCmsSection } from '@/features/public-cms/hooks/usePublicCmsQueries';
import { usePublicNavLabel } from '@/features/public-cms/hooks/usePublicNavLabel';
import { AboutBoardGrid } from '@/features/public-site/components/about/AboutBoardGrid';
import { AboutDonateCtaBanner } from '@/features/public-site/components/about/AboutDonateCtaBanner';
import { AboutJourneyCard } from '@/features/public-site/components/about/AboutJourneyCard';
import { AboutMissionVisionRow } from '@/features/public-site/components/about/AboutMissionVisionRow';
import { AboutPageHero } from '@/features/public-site/components/about/AboutPageHero';
import { PageContainer } from '@/features/public-site/components/PageContainer';
import { StoryPageIntro } from '@/features/public-site/components/StoryPageIntro';
import { StorySectionRow } from '@/features/public-site/components/StorySectionRow';
import { partitionAboutLandingContent } from '@/features/public-site/utils/partition-about-landing';
import {
  ABOUT_BOARD_INTRO_FALLBACK_SLUG,
  ABOUT_BOARD_INTRO_SLUG,
  isAboutBoardMember,
} from '@/features/public-site/utils/team-content-slugs';

export function PublicAboutPageView() {
  const { t } = useTranslation();
  const { data: aboutEntries = [], isLoading: aboutLoading, isError: aboutError, refetch: refetchAbout } =
    usePublicCmsSection(CMS_SECTIONS.ABOUT_US);
  const { data: missionEntries = [], isLoading: missionLoading } = usePublicCmsSection(CMS_SECTIONS.MISSION_VISION);
  const { data: homeEntries = [], isLoading: homeLoading } = usePublicCmsSection(CMS_SECTIONS.HOME);
  const { data: allPages = [] } = usePublicCmsAll();

  const isLoading = aboutLoading || missionLoading || homeLoading;
  const { intro, hero, journey, journeyPortraitRight, journeySignature, cta, sections } =
    partitionAboutLandingContent(aboutEntries);

  const missionVision = filterPublicContentEntries(missionEntries);
  const mission = missionVision.find((entry) => entry.slug === 'mission') ?? null;
  const vision = missionVision.find((entry) => entry.slug === 'vision') ?? null;

  const orgStats = filterPublicContentEntries(homeEntries)
    .filter((entry) => entry.slug.startsWith('org-stat-'))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const teamContent = filterPublicContentEntries(aboutEntries);
  const teamIntro =
    teamContent.find((entry) => entry.slug === ABOUT_BOARD_INTRO_SLUG) ??
    teamContent.find((entry) => entry.slug === ABOUT_BOARD_INTRO_FALLBACK_SLUG) ??
    null;
  const boardMembers = teamContent.filter((entry) => isAboutBoardMember(entry));

  const pageTitle = usePublicNavLabel(allPages, NAV_SLUGS.about, t('nav.about'));
  const heroTitle = hero?.title ?? intro?.title ?? pageTitle;
  const heroImage = hero?.imageUrl ?? null;
  const hasContent = Boolean(intro || hero || journey || sections.length > 0 || mission || vision || boardMembers.length);

  return (
    <>
      <AboutPageHero
        title={heroTitle}
        backgroundImageUrl={heroImage}
        pages={allPages}
        currentLabel={pageTitle}
      />

      <PublicCmsState
        isLoading={isLoading}
        isError={aboutError}
        isEmpty={!hasContent}
        onRetry={() => void refetchAbout()}
        emptyDescription="Publish CMS entries with slug about, about-hero, about-journey-resilience, about-journey-signature, mission, vision, org-stat-*, and team-* to build this page."
      >
        <PageContainer className="space-y-14 py-10 md:space-y-20 md:py-14">
          {intro ? <StoryPageIntro intro={intro} pageTitle={pageTitle} /> : null}

          {sections.map((entry, index) => (
            <StorySectionRow key={entry.id} entry={entry} reverse={index % 2 === 1} />
          ))}
        </PageContainer>

        {journey ? (
          <AboutJourneyCard entry={journey} rightPortrait={journeyPortraitRight} signature={journeySignature} />
        ) : null}

        <PageContainer className="space-y-14 py-10 md:space-y-20 md:py-14">
          {mission ? (
            <AboutMissionVisionRow entry={mission} stats={orgStats} showStats showActions />
          ) : null}

          {vision ? <AboutMissionVisionRow entry={vision} reverse /> : null}

          <AboutBoardGrid
            heading={teamIntro?.heading ?? t('fallbacks.theFamily')}
            title={teamIntro?.title ?? t('fallbacks.meetBoard')}
            description={
              teamIntro?.subheading ?? teamIntro?.body ?? t('fallbacks.boardIntro')
            }
            members={boardMembers}
          />

          <AboutDonateCtaBanner entry={cta} />
        </PageContainer>
      </PublicCmsState>
    </>
  );
}
