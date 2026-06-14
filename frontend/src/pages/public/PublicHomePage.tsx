import { AlertCircleIcon, RefreshCwIcon } from 'lucide-react';
import { AppButton } from '@/components/app';
import { usePublicHomeContent } from '@/features/public-site/hooks/usePublicHomeContent';
import {
  AboutSection,
  ContactCtaSection,
  GalleryPreviewSection,
  HeroSection,
  ImpactStatsSection,
  MissionVisionSection,
  ProgramsSection,
  TeamSection,
} from '@/features/public-site/components/sections';
import {
  CardsSectionSkeleton,
  GallerySectionSkeleton,
  HeroSectionSkeleton,
  SplitSectionSkeleton,
  StatsSectionSkeleton,
} from '@/features/public-site/components/SectionSkeletons';
import { PageContainer } from '@/features/public-site/components/PageContainer';

export function PublicHomePage() {
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
          <h1 className="mt-4 text-2xl font-bold">Unable to load website content</h1>
          <p className="mt-2 text-muted-foreground">Please check your connection and try again.</p>
          <AppButton className="mt-6" variant="outline" onClick={refetchAll}>
            <RefreshCwIcon className="size-4" />
            Try again
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
          <CardsSectionSkeleton cards={3} />
        </PageContainer>
        <PageContainer className="py-14 md:py-20">
          <CardsSectionSkeleton cards={4} />
        </PageContainer>
        <PageContainer className="bg-surface py-14 md:py-20">
          <GallerySectionSkeleton />
        </PageContainer>
      </>
    );
  }

  const aboutLabel = aboutEntries[0]?.title;
  const contactLabel = contactEntries[0]?.title;

  return (
    <>
      {homeContent.hero ? (
        <HeroSection entry={homeContent.hero} aboutLabel={aboutLabel} contactLabel={contactLabel} />
      ) : null}

      {aboutEntries.length > 0 ? <AboutSection entries={aboutEntries} /> : null}

      {missionEntries.length > 0 ? <MissionVisionSection entries={missionEntries} /> : null}

      <ImpactStatsSection stats={homeContent.stats} sectionHeading={homeContent.statsHeading} />

      <ProgramsSection programs={homeContent.programs} sectionHeading={homeContent.programsHeading} />

      <TeamSection members={homeContent.team} sectionHeading={homeContent.teamHeading} />

      <GalleryPreviewSection items={homeContent.gallery} sectionHeading={homeContent.galleryHeading} />

      {contactEntries.length > 0 ? <ContactCtaSection entries={contactEntries} /> : null}
    </>
  );
}
