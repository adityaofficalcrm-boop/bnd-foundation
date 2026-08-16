import { Link } from 'react-router-dom';
import { ChevronRightIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { resolveHeroBackground } from '@/config/site-assets';
import { usePublicNavLabel } from '@/features/public-cms/hooks/usePublicNavLabel';
import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';
import { PageContainer } from '@/features/public-site/components/PageContainer';
import { NAV_SLUGS } from '@/config/public-nav';

type AboutPageHeroProps = {
  title: string;
  backgroundImageUrl?: string | null;
  pages: CmsPublicPage[];
  currentLabel: string;
};

export function AboutPageHero({ title, backgroundImageUrl, pages, currentLabel }: AboutPageHeroProps) {
  const { t } = useTranslation();
  const backgroundSrc = backgroundImageUrl ?? resolveHeroBackground();
  const homeLabel = usePublicNavLabel(pages, NAV_SLUGS.home, t('nav.home'));

  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundSrc})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-primary/82" aria-hidden="true" />

      <PageContainer className="relative py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-2xl font-bold tracking-tight text-primary-foreground sm:text-3xl md:text-4xl lg:text-5xl">
            {title}
          </h1>
          <nav aria-label={t('a11y.breadcrumb')} className="mt-5 text-sm text-primary-foreground/85">
            <ol className="flex flex-wrap items-center justify-center gap-1.5">
              <li>
                <Link to="/" className="transition-colors hover:text-accent">
                  {homeLabel}
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRightIcon className="size-4" />
              </li>
              <li className="font-medium text-primary-foreground" aria-current="page">
                {currentLabel}
              </li>
            </ol>
          </nav>
        </div>
      </PageContainer>
    </section>
  );
}
