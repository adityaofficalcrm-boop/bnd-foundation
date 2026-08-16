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
import { ImpactSectionCard } from '@/features/public-site/components/impact/ImpactSectionCard';
import { PageContainer } from '@/features/public-site/components/PageContainer';
import { partitionStoryContent } from '@/features/public-site/utils/partition-story-content';

const IMPACT_HERO_SLUG = 'impact-hero';
const IMPACT_INTRO_SLUG = 'impact';
const IMPACT_CTA_SLUG = 'impact-cta';

export function PublicImpactPageView() {
  const { t } = useTranslation();
  const { data: entries = [], isLoading, isError, refetch } = usePublicCmsSection(CMS_SECTIONS.ABOUT_US);
  const { data: allPages = [] } = usePublicCmsAll();

  const contentEntries = filterPublicContentEntries(entries);
  const hero = contentEntries.find((entry) => entry.slug === IMPACT_HERO_SLUG) ?? null;
  const { intro, sections, cta } = partitionStoryContent(
    entries,
    IMPACT_INTRO_SLUG,
    'impact-',
    IMPACT_CTA_SLUG,
    [IMPACT_HERO_SLUG],
  );

  const pageTitle = usePublicNavLabel(allPages, NAV_SLUGS.aboutImpact, t('fallbacks.ourImpact'));
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
        emptyDescription="Publish CMS entries with slug impact-hero, impact, impact-*, and impact-cta to build this page."
      >
        <PageContainer className="space-y-14 py-10 md:space-y-16 md:py-14">
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

          {sections.length > 0 ? (
            <div className="space-y-8 rounded-2xl bg-surface p-4 md:space-y-10 md:p-8">
              {sections.map((entry, index) => (
                <ImpactSectionCard key={entry.id} entry={entry} reverse={index % 2 === 1} />
              ))}
            </div>
          ) : null}

          <AboutDonateCtaBanner entry={cta} />
        </PageContainer>
      </PublicCmsState>
    </>
  );
}
