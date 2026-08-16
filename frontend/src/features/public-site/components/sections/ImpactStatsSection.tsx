import {
  BookOpenIcon,
  BriefcaseMedicalIcon,
  type LucideIcon,
  UserRoundIcon,
  UsersIcon,
} from 'lucide-react';
import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';
import { resolveCmsSectionDisplay } from '@/features/public-cms/utils/resolve-cms-display';
import { SectionShell } from '@/features/public-site/components/SectionShell';
import { cn } from '@/lib/utils';

type ImpactStatsSectionProps = {
  stats: CmsPublicPage[];
  sectionHeading?: CmsPublicPage | null;
};

function resolveStatIcon(slug: string): LucideIcon {
  const normalized = slug.toLowerCase();

  if (normalized.includes('education')) return BookOpenIcon;
  if (normalized.includes('stem') || normalized.includes('mentor')) return UserRoundIcon;
  if (normalized.includes('migrant') || normalized.includes('child')) return UsersIcon;
  if (normalized.includes('aid') || normalized.includes('family') || normalized.includes('relief')) {
    return BriefcaseMedicalIcon;
  }

  return BookOpenIcon;
}

function StatCardIcon({ stat }: { stat: CmsPublicPage }) {
  const Icon = resolveStatIcon(stat.slug);

  if (stat.imageUrl) {
    return (
      <img
        src={stat.imageUrl}
        alt=""
        className="size-8 object-contain"
        loading="lazy"
      />
    );
  }

  return <Icon className="size-8 text-primary-foreground" aria-hidden="true" />;
}

export function ImpactStatsSection({ stats, sectionHeading }: ImpactStatsSectionProps) {
  if (stats.length === 0) return null;

  const header = resolveCmsSectionDisplay(sectionHeading);
  const description =
    header.description ??
    (sectionHeading?.body?.trim() && sectionHeading.body.trim() !== header.title
      ? sectionHeading.body.trim()
      : undefined);

  return (
    <SectionShell
      id="impact"
      variant="muted"
      className="relative overflow-hidden bg-background"
      animate={false}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,76,129,0.04),transparent_70%)]" />

      {(header.eyebrow || header.title || description) && (
        <header className="relative mx-auto mb-10 max-w-3xl text-center md:mb-14">
          {header.eyebrow ? (
            <p className="font-serif text-2xl italic text-secondary md:text-[1.75rem]">{header.eyebrow}</p>
          ) : null}
          {header.title ? (
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">{header.title}</h2>
          ) : null}
          {description ? (
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">{description}</p>
          ) : null}
        </header>
      )}

      <div
        className={cn(
          'relative grid gap-6',
          stats.length >= 4 ? 'sm:grid-cols-2 xl:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3',
        )}
      >
        {stats.map((stat) => (
          <article
            key={stat.id}
            className="flex h-full flex-col items-center rounded-2xl border bg-card p-6 text-center shadow-card transition-all duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:border-primary/25 motion-safe:hover:shadow-elevated"
          >
            <div
              className="mb-5 flex size-16 items-center justify-center rounded-full bg-primary"
              aria-hidden="true"
            >
              <StatCardIcon stat={stat} />
            </div>
            <h3 className="text-base font-bold leading-snug text-foreground md:text-lg">{stat.title}</h3>
            {stat.subheading ? (
              <p className="mt-2 text-sm font-semibold text-primary">{stat.subheading}</p>
            ) : null}
            {stat.body ? (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{stat.body}</p>
            ) : null}
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
