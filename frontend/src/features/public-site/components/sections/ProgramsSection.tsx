import { ArrowUpRightIcon } from 'lucide-react';
import { CmsBodyContent } from '@/features/public-cms/components/CmsBodyContent';
import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';
import { SectionShell } from '@/features/public-site/components/SectionShell';

type ProgramsSectionProps = {
  programs: CmsPublicPage[];
  sectionHeading?: CmsPublicPage | null;
};

export function ProgramsSection({ programs, sectionHeading }: ProgramsSectionProps) {
  if (programs.length === 0) return null;

  const eyebrow = sectionHeading?.heading ?? programs[0]?.heading;
  const title = sectionHeading?.title;
  const description = sectionHeading?.subheading ?? sectionHeading?.body;

  return (
    <SectionShell id="programs" variant="muted" eyebrow={eyebrow ?? undefined} title={title} description={description}>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {programs.map((program, index) => (
          <article
            key={program.id}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-card transition-all duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-elevated"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {program.imageUrl ? (
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={program.imageUrl}
                  alt={program.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-60" />
              </div>
            ) : (
              <div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent" aria-hidden="true" />
            )}
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl font-bold tracking-tight">{program.title}</h3>
                <ArrowUpRightIcon className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
              {program.subheading ? (
                <p className="mt-2 text-sm font-medium text-secondary">{program.subheading}</p>
              ) : null}
              <CmsBodyContent body={program.body} className="mt-4 flex-1 text-sm" />
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
