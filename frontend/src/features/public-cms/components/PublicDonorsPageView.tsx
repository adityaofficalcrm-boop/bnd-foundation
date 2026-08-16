import { useTranslation } from 'react-i18next';
import { NAV_SLUGS } from '@/config/public-nav';
import { CMS_SECTIONS } from '@/features/cms/types/cms.types';
import { PublicCmsState } from '@/features/public-cms/components/PublicCmsState';
import { CmsBodyContent } from '@/features/public-cms/components/CmsBodyContent';
import { filterPublicContentEntries } from '@/features/public-cms/utils/cms-entry-filters';
import { usePublicCmsAll, usePublicCmsSection } from '@/features/public-cms/hooks/usePublicCmsQueries';
import { usePublicNavLabel } from '@/features/public-cms/hooks/usePublicNavLabel';
import { AboutDonateCtaBanner } from '@/features/public-site/components/about/AboutDonateCtaBanner';
import { AboutPageHero } from '@/features/public-site/components/about/AboutPageHero';
import { DonorListCard } from '@/features/public-site/components/donors/DonorListCard';
import { PageContainer } from '@/features/public-site/components/PageContainer';
import { partitionStoryContent } from '@/features/public-site/utils/partition-story-content';
import { cn } from '@/lib/utils';
import { SCROLLABLE_LIST_CLASSNAME, shouldUseScrollableList } from '@/features/public-site/utils/cms-list-scroll';

const DONORS_HERO_SLUG = 'donors-hero';
const DONORS_INTRO_SLUG = 'donors';
const DONORS_LIST_HEADING_SLUG = 'donors-list-heading';
const DONORS_CTA_SLUG = 'donors-cta';

export function PublicDonorsPageView() {
  const { t } = useTranslation();
  const { data: entries = [], isLoading, isError, refetch } = usePublicCmsSection(CMS_SECTIONS.ABOUT_US);
  const { data: allPages = [] } = usePublicCmsAll();

  const contentEntries = filterPublicContentEntries(entries);
  const hero = contentEntries.find((entry) => entry.slug === DONORS_HERO_SLUG) ?? null;
  const listHeading = contentEntries.find((entry) => entry.slug === DONORS_LIST_HEADING_SLUG) ?? null;
  const { intro, sections: donorCards, cta } = partitionStoryContent(
    entries,
    DONORS_INTRO_SLUG,
    'donor-',
    DONORS_CTA_SLUG,
    [DONORS_HERO_SLUG, DONORS_LIST_HEADING_SLUG],
  );

  const pageTitle = usePublicNavLabel(allPages, NAV_SLUGS.aboutDonors, t('fallbacks.ourDonors'));
  const heroTitle = hero?.title ?? intro?.title ?? pageTitle;
  const heroImage = hero?.imageUrl ?? intro?.imageUrl ?? null;
  const listEyebrow = listHeading?.heading ?? t('fallbacks.recentDonations');
  const listTitle = listHeading?.title ?? t('fallbacks.thankYouDifference');
  const hasContent = Boolean(intro || hero || donorCards.length > 0 || cta);
  const scrollDonorList = shouldUseScrollableList(donorCards.length);

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
        isError={isError}
        isEmpty={!hasContent}
        onRetry={() => void refetch()}
        emptyDescription="Publish CMS entries with slug donors-hero, donors, donor-*, donors-list-heading, and donors-cta to build this page."
      >
        <PageContainer className="space-y-14 py-10 md:space-y-16 md:py-14">
          {intro?.body || intro?.title ? (
            <div className="mx-auto max-w-3xl space-y-5 text-center">
              {intro.heading ? (
                <div className="flex items-center justify-center gap-3">
                  <span className="h-px w-10 shrink-0 bg-border" aria-hidden="true" />
                  <p className="text-sm font-medium text-muted-foreground">{intro.heading}</p>
                  <span className="h-px w-10 shrink-0 bg-border" aria-hidden="true" />
                </div>
              ) : null}
              <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                {intro.title ?? pageTitle}
              </h2>
              {intro.body ? (
                <CmsBodyContent
                  body={intro.body}
                  className="text-base leading-relaxed text-muted-foreground md:text-lg"
                />
              ) : null}
            </div>
          ) : null}

          {donorCards.length > 0 ? (
            <div className="mx-auto max-w-4xl space-y-6">
              <header className="space-y-3 text-center">
                <p className="text-sm font-medium text-muted-foreground">{listEyebrow}</p>
                <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{listTitle}</h2>
              </header>

              <div
                className={cn('space-y-4', scrollDonorList && SCROLLABLE_LIST_CLASSNAME)}
                role={scrollDonorList ? 'region' : undefined}
                aria-label={scrollDonorList ? 'Donor list, scroll for more' : undefined}
              >
                {donorCards.map((donor) => (
                  <DonorListCard key={donor.id} donor={donor} />
                ))}
              </div>
            </div>
          ) : null}

          <AboutDonateCtaBanner entry={cta} />
        </PageContainer>
      </PublicCmsState>
    </>
  );
}
