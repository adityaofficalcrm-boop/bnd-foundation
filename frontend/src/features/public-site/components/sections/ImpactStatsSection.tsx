import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';
import { SectionShell } from '@/features/public-site/components/SectionShell';

type ImpactStatsSectionProps = {
  stats: CmsPublicPage[];
  sectionHeading?: CmsPublicPage | null;
};

export function ImpactStatsSection({ stats, sectionHeading }: ImpactStatsSectionProps) {
  if (stats.length === 0) return null;

  return (
    <SectionShell
      id="impact"
      eyebrow={sectionHeading?.heading ?? undefined}
      title={sectionHeading?.title}
      description={sectionHeading?.subheading ?? sectionHeading?.body}
    >
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.id}
            className="rounded-2xl border bg-card p-6 text-center shadow-card transition-all duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:border-primary/30 motion-safe:hover:shadow-elevated"
          >
            <p className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
              {stat.subheading ?? stat.title}
            </p>
            <h3 className="mt-2 text-sm font-semibold text-foreground md:text-base">
              {stat.subheading ? stat.title : stat.heading}
            </h3>
            {stat.body ? (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{stat.body}</p>
            ) : null}
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
