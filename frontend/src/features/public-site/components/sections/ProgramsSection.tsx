import { resolveProgramImage } from '@/config/site-assets';
import { CmsBodyContent } from '@/features/public-cms/components/CmsBodyContent';
import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';
import { resolveCmsSectionDisplay } from '@/features/public-cms/utils/resolve-cms-display';
import { SectionShell } from '@/features/public-site/components/SectionShell';

type ProgramsSectionProps = {
  programs: CmsPublicPage[];
  sectionHeading?: CmsPublicPage | null;
};

export function ProgramsSection({ programs, sectionHeading }: ProgramsSectionProps) {
  if (programs.length === 0) return null;

  const header = resolveCmsSectionDisplay(sectionHeading);
  const description =
    header.description ??
    (sectionHeading?.body?.trim() && sectionHeading.body.trim() !== header.title
      ? sectionHeading.body.trim()
      : undefined);

  return (
    <SectionShell
      id="programs"
      eyebrow={header.eyebrow}
      title={header.title}
      description={description}
      className="bg-background"
    >
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {programs.map((program) => {
          const imageSrc = resolveProgramImage(program.slug, program.imageUrl);

          return (
            <article
              key={program.id}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-card transition-all duration-300 motion-safe:hover:-translate-y-1.5 motion-safe:hover:shadow-elevated"
            >
              <div className="relative aspect-square overflow-hidden bg-surface">
                <img
                  src={imageSrc}
                  alt={program.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-bold leading-snug text-foreground">{program.title}</h3>
                {program.subheading ? (
                  <p className="mt-1 text-xs font-semibold text-secondary uppercase tracking-wide">
                    {program.subheading}
                  </p>
                ) : null}
                <CmsBodyContent body={program.body} className="mt-3 flex-1 text-sm leading-relaxed" />
              </div>
            </article>
          );
        })}
      </div>
    </SectionShell>
  );
}
