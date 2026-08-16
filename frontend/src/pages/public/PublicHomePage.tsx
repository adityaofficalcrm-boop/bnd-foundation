import { AlertCircleIcon, RefreshCwIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AppButton } from '@/components/app';
import { usePublicHomeContent } from '@/features/public-site/hooks/usePublicHomeContent';
import {
  AboutSection,
  HeroSection,
  FundraiseSection,
  HomeCtaSection,
  ImpactStatsSection,
  MissionVisionSection,
  PartnersSection,
  ProgramsSection,
  DonateBannerSection,
  FacebookUpdatesSection,
  TestimonialsSection,
} from '@/features/public-site/components/sections';
import {
  CardsSectionSkeleton,
  HeroSectionSkeleton,
  SplitSectionSkeleton,
  StatsSectionSkeleton,
} from '@/features/public-site/components/SectionSkeletons';
import { PageContainer } from '@/features/public-site/components/PageContainer';

export function PublicHomePage() {
  const { t } = useTranslation();
  const {
    homeContent,
    aboutEntries,
    missionEntries,
    contactEntries,
    isLoading,
    isError,
    refetchAll,
  } = usePublicHomeContent();

  if (isError) {
    return (
      <PageContainer className="py-20">
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-10 text-center" role="alert">
          <AlertCircleIcon className="mx-auto size-12 text-destructive" />
          <h1 className="mt-4 text-2xl font-bold">{t('common.homeLoadError')}</h1>
          <p className="mt-2 text-muted-foreground">{t('common.homeLoadHint')}</p>
          <AppButton className="mt-6" variant="outline" onClick={refetchAll}>
            <RefreshCwIcon className="size-4" />
            {t('common.tryAgain')}
          </AppButton>
        </div>
      </PageContainer>
    );
  }

  if (isLoading) {
    return (
      <>
        <HeroSectionSkeleton />
        <PageContainer className="py-14 md:py-20">
          <SplitSectionSkeleton />
        </PageContainer>
        <PageContainer className="bg-surface py-14 md:py-20">
          <CardsSectionSkeleton cards={2} />
        </PageContainer>
        <PageContainer className="py-14 md:py-20">
          <StatsSectionSkeleton />
        </PageContainer>
        <PageContainer className="bg-surface py-14 md:py-20">
          <CardsSectionSkeleton cards={4} />
        </PageContainer>
        <PageContainer className="py-14 md:py-20">
          <CardsSectionSkeleton cards={3} />
        </PageContainer>
      </>
    );
  }

  return (
    <>
      {homeContent.hero ? <HeroSection entry={homeContent.hero} /> : null}

      {aboutEntries.length > 0 ? <AboutSection entries={aboutEntries} /> : null}

      {missionEntries.length > 0 ? <MissionVisionSection entries={missionEntries} /> : null}

      <ProgramsSection programs={homeContent.programs} sectionHeading={homeContent.programsHeading} />

      <HomeCtaSection
        ctaHeading={homeContent.ctaHeading}
        ctaCards={homeContent.ctas}
        contactEntry={contactEntries[0] ?? null}
      />

      <ImpactStatsSection stats={homeContent.stats} sectionHeading={homeContent.statsHeading} />

      <FundraiseSection items={homeContent.fundraise} sectionHeading={homeContent.fundraiseHeading} />

      <PartnersSection
        items={homeContent.partners}
        sectionHeading={homeContent.partnersHeading}
        orgStats={homeContent.orgStats}
      />

      <TestimonialsSection items={homeContent.testimonials} sectionHeading={homeContent.testimonialsHeading} />

      <DonateBannerSection slides={homeContent.donateSlides} />

      <FacebookUpdatesSection entry={homeContent.facebookUpdates} />
    </>
  );
}
