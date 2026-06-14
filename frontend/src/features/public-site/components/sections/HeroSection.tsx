import { ArrowRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppButton } from '@/components/app';
import { CmsBodyContent } from '@/features/public-cms/components/CmsBodyContent';
import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';
import { PageContainer } from '@/features/public-site/components/PageContainer';

type HeroSectionProps = {
  entry: CmsPublicPage;
  aboutLabel?: string;
  contactLabel?: string;
};

export function HeroSection({ entry, aboutLabel, contactLabel }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_45%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 size-96 rounded-full bg-secondary/20 blur-3xl"
        aria-hidden="true"
      />

      <PageContainer className="relative py-16 md:py-24 lg:py-28">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-left-4 motion-safe:duration-700 space-y-6">
            {entry.heading ? (
              <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-[0.18em] uppercase backdrop-blur-sm">
                {entry.heading}
              </p>
            ) : null}
            <h1 className="text-4xl leading-[1.1] font-bold tracking-tight md:text-5xl lg:text-6xl">
              {entry.title}
            </h1>
            {entry.subheading ? (
              <p className="max-w-2xl text-lg leading-relaxed text-primary-foreground/90 md:text-xl">
                {entry.subheading}
              </p>
            ) : null}
            <CmsBodyContent body={entry.body} className="max-w-2xl text-primary-foreground/85" />
            <div className="flex flex-wrap gap-3 pt-2">
              {aboutLabel ? (
                <AppButton asChild size="lg" variant="accent">
                  <Link to="/about">
                    {aboutLabel}
                    <ArrowRightIcon className="size-4" />
                  </Link>
                </AppButton>
              ) : null}
              {contactLabel ? (
                <AppButton
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-white/10 text-primary-foreground hover:bg-white/15 hover:text-primary-foreground"
                >
                  <Link to="/contact">{contactLabel}</Link>
                </AppButton>
              ) : null}
            </div>
          </div>

          {entry.imageUrl ? (
            <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-right-4 motion-safe:duration-700 motion-safe:delay-150 relative">
              <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/5 shadow-elevated">
                <img
                  src={entry.imageUrl}
                  alt={entry.title}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                  loading="eager"
                />
              </div>
              <div
                className="absolute -right-4 -bottom-4 -z-10 size-full rounded-2xl bg-accent/30 blur-2xl"
                aria-hidden="true"
              />
            </div>
          ) : null}
        </div>
      </PageContainer>
    </section>
  );
}
