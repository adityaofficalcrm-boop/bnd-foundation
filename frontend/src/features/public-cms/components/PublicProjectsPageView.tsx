import { useTranslation } from 'react-i18next';
import { NAV_SLUGS } from '@/config/public-nav';
import { CMS_SECTIONS } from '@/features/cms/types/cms.types';
import { PublicCmsState } from '@/features/public-cms/components/PublicCmsState';
import { CmsBodyContent } from '@/features/public-cms/components/CmsBodyContent';
import { usePublicCmsAll, usePublicCmsSection } from '@/features/public-cms/hooks/usePublicCmsQueries';
import { filterPublicContentEntries } from '@/features/public-cms/utils/cms-entry-filters';
import { usePublicNavLabel } from '@/features/public-cms/hooks/usePublicNavLabel';
import { AboutDonateCtaBanner } from '@/features/public-site/components/about/AboutDonateCtaBanner';
import { AboutPageHero } from '@/features/public-site/components/about/AboutPageHero';
import { PageContainer } from '@/features/public-site/components/PageContainer';
import { FeaturedProjectCard } from '@/features/public-site/components/projects/FeaturedProjectCard';
import { GrantListCard } from '@/features/public-site/components/projects/GrantListCard';
import {
  isFeaturedProjectSlug,
  isGrantCardSlug,
  PROJECTS_CTA_SLUG,
  PROJECTS_GRANTS_HEADING_SLUG,
  PROJECTS_HERO_SLUG,
  PROJECTS_INTRO_SLUG,
} from '@/features/public-site/utils/project-content-slugs';
import { SCROLLABLE_LIST_CLASSNAME, shouldUseScrollableList } from '@/features/public-site/utils/cms-list-scroll';
import { cn } from '@/lib/utils';

export function PublicProjectsPageView() {
  const { t } = useTranslation();
  const { data: entries = [], isLoading, isError, refetch } = usePublicCmsSection(CMS_SECTIONS.ABOUT_US);
  const { data: allPages = [] } = usePublicCmsAll();

  const contentEntries = filterPublicContentEntries(entries);
  const hero = contentEntries.find((entry) => entry.slug === PROJECTS_HERO_SLUG) ?? null;
  const intro = contentEntries.find((entry) => entry.slug === PROJECTS_INTRO_SLUG) ?? null;
  const grantsHeading = contentEntries.find((entry) => entry.slug === PROJECTS_GRANTS_HEADING_SLUG) ?? null;
  const featured = contentEntries
    .filter((entry) => isFeaturedProjectSlug(entry.slug))
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const grants = contentEntries
    .filter((entry) => isGrantCardSlug(entry.slug))
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const cta =
    contentEntries.find((entry) => entry.slug === PROJECTS_CTA_SLUG) ??
    contentEntries.find((entry) => entry.slug === 'about-cta') ??
    null;

  const pageTitle = usePublicNavLabel(allPages, NAV_SLUGS.projects, t('fallbacks.currentProjects'));
  const heroTitle = hero?.title ?? pageTitle;
  const heroImage = hero?.imageUrl ?? intro?.imageUrl ?? null;
  const grantsEyebrow = grantsHeading?.heading ?? t('fallbacks.grantsReceived');
  const grantsTitle = grantsHeading?.title ?? t('fallbacks.thankYouDifference');
  const scrollGrantList = shouldUseScrollableList(grants.length);
  const hasContent = Boolean(intro || hero || featured.length > 0 || grants.length > 0 || cta);

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
        emptyDescription="Publish CMS entries with slug projects-hero, projects, project-*, projects-grants-heading, grant-*, and projects-cta to build this page."
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
                {intro.title ?? t('fallbacks.partnersInChange')}
              </h2>
              {intro.body ? (
                <CmsBodyContent
                  body={intro.body}
                  className="text-base leading-relaxed text-muted-foreground md:text-lg"
                />
              ) : null}
            </div>
          ) : null}

          {featured.map((project) => (
            <FeaturedProjectCard key={project.id} project={project} />
          ))}

          {grants.length > 0 ? (
            <div className="mx-auto max-w-4xl space-y-6">
              <header className="space-y-3 text-center">
                <p className="text-sm font-medium text-muted-foreground">{grantsEyebrow}</p>
                <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{grantsTitle}</h2>
              </header>

              <div
                className={cn('space-y-4', scrollGrantList && SCROLLABLE_LIST_CLASSNAME)}
                role={scrollGrantList ? 'region' : undefined}
                aria-label={scrollGrantList ? 'Grants list, scroll for more' : undefined}
              >
                {grants.map((grant) => (
                  <GrantListCard key={grant.id} grant={grant} />
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
