import { ArrowRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppButton } from '@/components/app';
import { CmsBodyContent } from '@/features/public-cms/components/CmsBodyContent';
import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';
import { SectionShell } from '@/features/public-site/components/SectionShell';

type AboutSectionProps = {
  entries: CmsPublicPage[];
};

export function AboutSection({ entries }: AboutSectionProps) {
  const entry = entries[0];
  if (!entry) return null;

  const sectionTitle = entry.heading ?? entries.find((item) => item.subheading)?.subheading;
  const linkLabel = entries[1]?.title ?? entry.title;

  return (
    <SectionShell
      id="about"
      eyebrow={sectionTitle ?? undefined}
      title={entry.title}
      description={entry.subheading}
    >
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {entry.imageUrl ? (
          <div className="group relative overflow-hidden rounded-2xl border bg-card shadow-card">
            <img
              src={entry.imageUrl}
              alt={entry.title}
              className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>
        ) : null}
        <div className="space-y-6">
          <CmsBodyContent body={entry.body} className="text-base md:text-lg" />
          {entries.slice(1).map((item) => (
            <div key={item.id} className="rounded-xl border border-secondary/20 bg-secondary/5 p-5">
              <h3 className="font-semibold text-foreground">{item.title}</h3>
              {item.subheading ? (
                <p className="mt-1 text-sm text-muted-foreground">{item.subheading}</p>
              ) : null}
              <CmsBodyContent body={item.body} className="mt-3 text-sm" />
            </div>
          ))}
          <AppButton asChild variant="outline">
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
