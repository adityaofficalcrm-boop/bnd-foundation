import { ArrowRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppButton } from '@/components/app';
import { resolveAboutImage } from '@/config/site-assets';
import { CmsBodyContent } from '@/features/public-cms/components/CmsBodyContent';
import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';
import { SectionShell } from '@/features/public-site/components/SectionShell';

type AboutSectionProps = {
  entries: CmsPublicPage[];
};

export function AboutSection({ entries }: AboutSectionProps) {
  const primary = entries.find((item) => item.slug === 'home-about');
  if (!primary) return null;

  const secondary = entries.filter((item) => item.slug !== primary.slug);
  const imageSrc = resolveAboutImage(primary.imageUrl);
  const linkLabel = secondary[0]?.title ?? primary.title;

  return (
    <SectionShell
      id="about"
      eyebrow={primary.heading ?? undefined}
      title={primary.title}
      description={primary.subheading}
      className="bg-background"
    >
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative order-2 lg:order-1">
          <div className="overflow-hidden rounded-2xl border bg-card shadow-elevated">
            <img
              src={imageSrc}
              alt={primary.title}
              className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
              loading="lazy"
            />
          </div>
          <div
            className="absolute -bottom-4 -left-4 -z-10 size-32 rounded-2xl bg-secondary/20 md:size-40"
            aria-hidden="true"
          />
        </div>
        <div className="order-1 space-y-6 lg:order-2">
          <CmsBodyContent body={primary.body} className="text-base leading-relaxed md:text-lg" />
          {secondary.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border-l-4 border-secondary bg-surface p-5 shadow-card"
            >
              <h3 className="font-semibold text-foreground">{item.title}</h3>
              {item.subheading ? (
                <p className="mt-1 text-sm font-medium text-secondary">{item.subheading}</p>
              ) : null}
              <CmsBodyContent body={item.body} className="mt-3 text-sm" />
            </div>
          ))}
          <AppButton asChild variant="primary">
            <Link to="/about">
              {linkLabel}
              <ArrowRightIcon className="size-4" />
            </Link>
          </AppButton>
        </div>
      </div>
    </SectionShell>
  );
}
