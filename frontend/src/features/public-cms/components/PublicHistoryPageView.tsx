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
import { HistorySectionRow } from '@/features/public-site/components/history/HistorySectionRow';
import { PageContainer } from '@/features/public-site/components/PageContainer';
import { partitionStoryContent } from '@/features/public-site/utils/partition-story-content';

const HISTORY_HERO_SLUG = 'history-hero';
const HISTORY_INTRO_SLUG = 'history';
const HISTORY_CTA_SLUG = 'history-cta';

export function PublicHistoryPageView() {
  const { t } = useTranslation();
  const { data: entries = [], isLoading, isError, refetch } = usePublicCmsSection(CMS_SECTIONS.ABOUT_US);
  const { data: allPages = [] } = usePublicCmsAll();

  const contentEntries = filterPublicContentEntries(entries);
  const hero = contentEntries.find((entry) => entry.slug === HISTORY_HERO_SLUG) ?? null;
  const { intro, sections, cta } = partitionStoryContent(
    entries,
    HISTORY_INTRO_SLUG,
    'history-',
    HISTORY_CTA_SLUG,
    [HISTORY_HERO_SLUG],
  );

  const pageTitle = usePublicNavLabel(allPages, NAV_SLUGS.aboutHistory, t('fallbacks.ourHistory'));
  const heroTitle = hero?.title ?? intro?.title ?? pageTitle;
  const heroImage = hero?.imageUrl ?? intro?.imageUrl ?? null;
  const hasContent = Boolean(intro || hero || sections.length > 0 || cta);

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
        emptyDescription="Publish CMS entries with slug history-hero, history, history-*, and history-cta to build this page."
      >
        <PageContainer className="space-y-14 py-10 md:space-y-20 md:py-14">
          {intro?.body ? (
            <div className="mx-auto max-w-3xl space-y-5 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                {intro.title ?? pageTitle}
              </h2>
              <CmsBodyContent
                body={intro.body}
                className="text-base leading-relaxed text-muted-foreground md:text-lg"
              />
            </div>
          ) : null}

          {sections.map((entry, index) => (
            <HistorySectionRow key={entry.id} entry={entry} reverse={index % 2 === 1} />
          ))}

          <AboutDonateCtaBanner entry={cta} />
        </PageContainer>
      </PublicCmsState>
    </>
  );
}
