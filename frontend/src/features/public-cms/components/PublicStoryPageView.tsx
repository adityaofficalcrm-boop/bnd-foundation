import { HeartIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppButton } from '@/components/app';
import { NAV_SLUGS } from '@/config/public-nav';
import { CMS_SECTIONS, type CmsSection } from '@/features/cms/types/cms.types';
import { PublicCmsState } from '@/features/public-cms/components/PublicCmsState';
import { CmsBodyContent } from '@/features/public-cms/components/CmsBodyContent';
import { usePublicCmsAll, usePublicCmsSection } from '@/features/public-cms/hooks/usePublicCmsQueries';
import { usePublicNavLabel } from '@/features/public-cms/hooks/usePublicNavLabel';
import { PageBreadcrumb } from '@/features/public-site/components/PageBreadcrumb';
import { PublicPageHero } from '@/features/public-site/components/PublicPageShell';
import { StoryPageIntro } from '@/features/public-site/components/StoryPageIntro';
import { StorySectionRow } from '@/features/public-site/components/StorySectionRow';
import { PageContainer } from '@/features/public-site/components/PageContainer';
import { partitionStoryContent } from '@/features/public-site/utils/partition-story-content';

export type PublicStoryPageConfig = {
  section: CmsSection;
  introSlug: string;
  sectionPrefix: string;
  ctaSlug: string;
  navSlug: string;
  fallbackTitle: string;
  emptyDescription: string;
  sectionLayout?: 'alternating' | 'stacked';
};

type PublicStoryPageViewProps = {
  config: PublicStoryPageConfig;
};

export function PublicStoryPageView({ config }: PublicStoryPageViewProps) {
  const { t } = useTranslation();
  const { data: entries = [], isLoading, isError, refetch } = usePublicCmsSection(config.section);
  const { data: allPages = [] } = usePublicCmsAll();

  const { intro, sections, cta } = partitionStoryContent(
    entries,
    config.introSlug,
    config.sectionPrefix,
    config.ctaSlug,
  );

  const pageTitle = usePublicNavLabel(allPages, config.navSlug, config.fallbackTitle);
  const hasContent = intro || sections.length > 0;

  return (
    <>
      <PublicPageHero
        title={intro?.title ?? pageTitle}
        description={intro?.subheading ?? undefined}
        eyebrow={intro?.heading ?? undefined}
      />

      <PublicCmsState
        isLoading={isLoading}
        isError={isError}
        isEmpty={!hasContent}
        onRetry={() => void refetch()}
        emptyDescription={config.emptyDescription}
      >
        <PageContainer className="space-y-12 py-10 md:space-y-16 md:py-14">
          <PageBreadcrumb pages={allPages} currentLabel={pageTitle} />

          {intro ? <StoryPageIntro intro={intro} pageTitle={pageTitle} /> : null}
          {sections.length > 0 ? (
            <div className="space-y-14 md:space-y-20">
              {sections.map((entry, index) =>
                config.sectionLayout === 'stacked' ? (
                  <article key={entry.id} className="mx-auto max-w-3xl space-y-4 rounded-2xl border bg-card p-6 shadow-card md:p-8">
                    {entry.heading ? (
                      <p className="text-sm font-semibold tracking-[0.18em] text-secondary uppercase">{entry.heading}</p>
                    ) : null}
                    <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{entry.title}</h2>
                    {entry.imageUrl ? (
                      <img src={entry.imageUrl} alt={entry.title} className="w-full rounded-xl object-cover" loading="lazy" />
                    ) : null}
                    <CmsBodyContent body={entry.body} />
                  </article>
                ) : (
                  <StorySectionRow key={entry.id} entry={entry} reverse={index % 2 === 1} />
                ),
              )}
            </div>
          ) : null}

          {cta ? (
            <section className="rounded-2xl border bg-gradient-to-br from-primary/5 via-background to-secondary/10 p-8 text-center shadow-card md:p-12">
              {cta.heading ? (
                <p className="text-sm font-semibold tracking-[0.18em] text-secondary uppercase">{cta.heading}</p>
              ) : null}
              <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">{cta.title}</h2>
              {cta.subheading ? (
                <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">{cta.subheading}</p>
              ) : null}
              {cta.body ? <CmsBodyContent body={cta.body} className="mx-auto mt-4 max-w-2xl text-muted-foreground" /> : null}
              <AppButton asChild variant="accent" size="lg" className="mt-8 font-semibold">
                <Link to={cta.meta?.ctaUrl ?? '/donate'}>
                  <HeartIcon className="size-4" aria-hidden="true" />
                  {cta.meta?.ctaLabel ?? t('cta.donateNow')}
                </Link>
              </AppButton>
            </section>
          ) : (
            <section className="rounded-2xl border bg-gradient-to-br from-primary/5 via-background to-secondary/10 p-8 text-center shadow-card md:p-12">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                {t('fallbacks.donateCause')}
                <span className="block text-primary">{t('fallbacks.impactLives')}</span>
              </h2>
              <AppButton asChild variant="accent" size="lg" className="mt-8 font-semibold">
                <Link to="/donate">
                  <HeartIcon className="size-4" aria-hidden="true" />
                  {t('cta.donateNow')}
                </Link>
              </AppButton>
            </section>
          )}
        </PageContainer>
      </PublicCmsState>
    </>
  );
}

export const ABOUT_PAGE_CONFIG: PublicStoryPageConfig = {
  section: CMS_SECTIONS.ABOUT_US,
  introSlug: 'about',
  sectionPrefix: 'about-',
  ctaSlug: 'about-cta',
  navSlug: NAV_SLUGS.about,
  fallbackTitle: 'About BnD Foundation',
  emptyDescription: 'Use PublicAboutPageView for the About landing page.',
};

/** @deprecated About landing uses PublicAboutPageView — config kept for reference. */
