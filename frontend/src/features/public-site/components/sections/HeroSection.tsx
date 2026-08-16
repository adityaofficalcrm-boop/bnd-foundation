import { ArrowRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppButton } from '@/components/app';
import { PublicDonateButton } from '@/components/layout/public/PublicDonateButton';
import { resolveHeroImage } from '@/config/site-assets';
import { resolveCmsHeroDisplay, resolveCmsHeroImageAlt } from '@/features/public-cms/utils/resolve-cms-display';
import { CmsBodyContent } from '@/features/public-cms/components/CmsBodyContent';
import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';
import { PageContainer } from '@/features/public-site/components/PageContainer';
import { cn } from '@/lib/utils';

type HeroSectionProps = {
  entry: CmsPublicPage;
};

function HeroDotCluster({ className }: { className?: string }) {
  return (
    <div className={cn('grid grid-cols-4 gap-2', className)} aria-hidden="true">
      {Array.from({ length: 16 }).map((_, index) => (
        <span key={index} className="size-1.5 rounded-full bg-primary/20" />
      ))}
    </div>
  );
}

export function HeroSection({ entry }: HeroSectionProps) {
  const { t } = useTranslation();
  const portraitSrc = resolveHeroImage(entry.imageUrl);
  const { eyebrow, title } = resolveCmsHeroDisplay(entry);
  const imageAlt = resolveCmsHeroImageAlt(entry);

  return (
    <section className="relative overflow-hidden bg-background">
      <PageContainer className="py-12 md:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 xl:gap-20">
          <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-left-6 motion-safe:duration-700 space-y-6 md:space-y-7">
            {eyebrow ? (
              <div className="flex items-center gap-3">
                <span className="h-px w-10 shrink-0 bg-primary" aria-hidden="true" />
                <p className="text-sm font-medium text-primary md:text-base">{eyebrow}</p>
              </div>
            ) : null}

            {title ? (
              <h1 className="max-w-xl text-[2rem] leading-[1.12] font-bold tracking-tight text-foreground sm:text-4xl md:text-[2.65rem] lg:text-5xl xl:text-[3.25rem]">
                {title}
              </h1>
            ) : null}

            <CmsBodyContent
              body={entry.body}
              className="max-w-xl space-y-0 text-base leading-relaxed text-muted-foreground md:text-[1.05rem]"
            />

            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap sm:items-center">
              <AppButton asChild size="lg" variant="primary" className="w-full font-semibold sm:w-auto">
                <Link to="/about">
                  {t('cta.learnMore')}
                  <ArrowRightIcon className="size-4" aria-hidden="true" />
                </Link>
              </AppButton>
              <PublicDonateButton size="lg" className="w-full sm:w-auto" />
            </div>
          </div>

          <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-right-6 motion-safe:duration-700 motion-safe:delay-150 relative mx-auto w-full max-w-md lg:max-w-none lg:min-h-[420px]">
            <div
              className="absolute top-[12%] right-[4%] -z-10 hidden h-[78%] w-[72%] rotate-[8deg] rounded-sm bg-primary md:block"
              aria-hidden="true"
            />
            <div
              className="absolute top-[22%] right-[18%] -z-10 hidden h-[62%] w-[58%] -rotate-[4deg] rounded-sm bg-primary/90 md:block"
              aria-hidden="true"
            />

            <HeroDotCluster className="absolute top-[18%] left-[2%] hidden md:grid" />
            <HeroDotCluster className="absolute right-[6%] bottom-[22%] hidden md:grid" />

            <img
              src={portraitSrc}
              alt={imageAlt}
              className="relative z-10 mx-auto w-full max-w-[22rem] object-contain object-bottom sm:max-w-[26rem] lg:mx-0 lg:max-w-none lg:pl-4"
              loading="eager"
            />
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
