import { QuoteIcon, StarIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';
import { SectionShell } from '@/features/public-site/components/SectionShell';
import { resolveCmsSectionDisplay } from '@/features/public-cms/utils/resolve-cms-display';
import { cn } from '@/lib/utils';

const AUTO_ROTATE_MS = 5000;

type TestimonialsSectionProps = {
  items: CmsPublicPage[];
  sectionHeading?: CmsPublicPage | null;
};

function TestimonialCard({ item }: { item: CmsPublicPage }) {
  return (
    <blockquote className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card p-8 pt-10 text-center shadow-card transition-all duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:border-primary/30 motion-safe:hover:shadow-elevated">
      <div
        className="absolute top-0 right-0 flex size-[4.5rem] items-center justify-center rounded-bl-[2rem] bg-primary text-primary-foreground shadow-md transition-transform duration-300 motion-safe:group-hover:scale-105"
        aria-hidden="true"
      >
        <QuoteIcon className="size-7" />
      </div>

      <div
        className="pointer-events-none absolute -bottom-8 -left-8 size-24 rounded-full bg-primary/5"
        aria-hidden="true"
      />

      <cite className="relative not-italic">
        <span className="text-lg font-bold tracking-tight text-foreground">{item.title}</span>
      </cite>

      <div className="relative mt-3 flex justify-center gap-1" aria-label="5 out of 5 stars">
        {Array.from({ length: 5 }).map((_, index) => (
          <StarIcon key={index} className="size-4 fill-accent text-accent" aria-hidden="true" />
        ))}
      </div>

      <p className="relative mt-5 flex-1 text-base leading-relaxed text-muted-foreground italic">
        &ldquo;{item.body?.trim()}&rdquo;
      </p>
      {item.subheading ? (
        <p className="relative mt-4 text-sm font-medium text-primary">{item.subheading}</p>
      ) : null}
    </blockquote>
  );
}

function getVisibleTestimonials(items: CmsPublicPage[], startIndex: number, visibleCount: number) {
  if (items.length === 0) return [];

  return Array.from({ length: Math.min(visibleCount, items.length) }, (_, offset) => {
    return items[(startIndex + offset) % items.length];
  });
}

export function TestimonialsSection({ items, sectionHeading }: TestimonialsSectionProps) {
  const { t } = useTranslation();
  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.sortOrder - b.sortOrder),
    [items],
  );

  const [slideIndex, setSlideIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(2);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const canRotate = sortedItems.length > 1;
  const displayCount = canRotate && sortedItems.length <= visibleCount ? 1 : Math.min(visibleCount, sortedItems.length);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');

    const updateVisibleCount = () => {
      setVisibleCount(media.matches ? 2 : 1);
    };

    updateVisibleCount();
    media.addEventListener('change', updateVisibleCount);
    return () => media.removeEventListener('change', updateVisibleCount);
  }, []);

  useEffect(() => {
    setSlideIndex(0);
    setProgress(0);
  }, [visibleCount, sortedItems.length]);

  useEffect(() => {
    if (!canRotate || isPaused) {
      return;
    }

    setProgress(0);
    const startedAt = Date.now();

    const timer = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const nextProgress = Math.min(100, (elapsed / AUTO_ROTATE_MS) * 100);
      setProgress(nextProgress);

      if (elapsed >= AUTO_ROTATE_MS) {
        setSlideIndex((current) => (current + 1) % sortedItems.length);
      }
    }, 50);

    return () => window.clearInterval(timer);
  }, [canRotate, isPaused, slideIndex, sortedItems.length]);

  if (sortedItems.length === 0) return null;

  const header = resolveCmsSectionDisplay(sectionHeading);
  const visibleItems = getVisibleTestimonials(sortedItems, slideIndex, displayCount);

  return (
    <SectionShell
      id="testimonials"
      variant="muted"
      className="relative overflow-hidden"
      animate={false}
      eyebrow={header.eyebrow}
      title={header.title ?? t('fallbacks.testimonials')}
      description={header.description}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,76,129,0.07),transparent_55%)]"
        aria-hidden="true"
      />

      <div
        className="relative space-y-6"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          setIsPaused(false);
          setProgress(0);
        }}
      >
        <div
          key={`${slideIndex}-${displayCount}`}
          className={cn(
            'grid gap-6 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-right-4 motion-safe:duration-500',
            displayCount > 1 ? 'md:grid-cols-2' : 'grid-cols-1',
          )}
          aria-live="polite"
          aria-atomic="true"
        >
          {visibleItems.map((item, index) => (
            <TestimonialCard key={`${item.id}-${slideIndex}-${index}`} item={item} />
          ))}
        </div>

        {canRotate ? (
          <div className="mx-auto max-w-xs">
            <div
              className="h-1 w-full overflow-hidden rounded-full bg-border"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
              aria-label="Testimonial carousel progress"
            >
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-75 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : null}
      </div>
    </SectionShell>
  );
}
