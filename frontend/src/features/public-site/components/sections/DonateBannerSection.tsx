import { ArrowRightIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { AppButton } from '@/components/app';
import { resolveDonateBannerImage } from '@/config/site-assets';
import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';
import { SectionShell } from '@/features/public-site/components/SectionShell';
import { cn } from '@/lib/utils';

const AUTO_ROTATE_MS = 6000;

type DonateBannerSectionProps = {
  slides: CmsPublicPage[];
};

function DonateSlide({ entry }: { entry: CmsPublicPage }) {
  const { t } = useTranslation();
  const imageSrc = resolveDonateBannerImage(entry.imageUrl);
  const ctaLabel = entry.meta?.ctaLabel?.trim() || t('cta.donateNow');
  const ctaUrl = entry.meta?.ctaUrl?.trim() || '/donate';

  return (
    <div className="relative min-h-[280px] overflow-hidden rounded-3xl md:min-h-[320px]">
      <img
        src={imageSrc}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
        <div className="absolute inset-0 bg-primary/85" aria-hidden="true" />

      <div className="relative flex min-h-[280px] flex-col items-center justify-center px-6 py-14 text-center md:min-h-[320px] md:px-10">
        {entry.title ? (
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl lg:text-5xl">
            {entry.title}
          </h2>
        ) : null}
        {entry.subheading ? (
          <p className="mt-2 text-2xl font-bold text-primary-foreground md:text-3xl lg:text-4xl">
            {entry.subheading}
          </p>
        ) : null}
        {entry.body?.trim() ? (
          <p className="mt-4 max-w-2xl text-base text-primary-foreground/90">{entry.body.trim()}</p>
        ) : null}

          <AppButton asChild size="lg" variant="accent" className="mt-8 font-semibold">
          <Link to={ctaUrl}>
            {ctaLabel}
            <ArrowRightIcon className="size-4" />
          </Link>
        </AppButton>
      </div>
    </div>
  );
}

export function DonateBannerSection({ slides }: DonateBannerSectionProps) {
  const sortedSlides = useMemo(
    () => [...slides].sort((a, b) => a.sortOrder - b.sortOrder),
    [slides],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const canRotate = sortedSlides.length > 1;

  useEffect(() => {
    setActiveIndex(0);
  }, [sortedSlides.length]);

  useEffect(() => {
    if (!canRotate || isPaused) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % sortedSlides.length);
    }, AUTO_ROTATE_MS);

    return () => window.clearInterval(timer);
  }, [canRotate, isPaused, sortedSlides.length]);

  if (sortedSlides.length === 0) return null;

  const safeIndex = Math.min(activeIndex, sortedSlides.length - 1);
  const activeSlide = sortedSlides[safeIndex];

  return (
    <SectionShell id="donate-banner" className="bg-background pt-0 md:pt-4" animate={false}>
      <div
        className="space-y-4"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {canRotate ? (
          <div className="flex justify-center gap-2">
            {sortedSlides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Show donate banner ${index + 1}`}
                aria-current={index === safeIndex ? 'true' : undefined}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'size-2.5 rounded-full transition-colors',
                  index === safeIndex ? 'bg-primary' : 'bg-border hover:bg-primary/40',
                )}
              />
            ))}
          </div>
        ) : null}

        <div
          key={activeSlide.id}
          className="motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500"
          aria-live="polite"
        >
          <DonateSlide entry={activeSlide} />
        </div>
      </div>
    </SectionShell>
  );
}
