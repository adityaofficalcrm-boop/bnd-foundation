import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';
import { SectionShell } from '@/features/public-site/components/SectionShell';
import { TargetIcon, TelescopeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppButton } from '@/components/app';
import { CmsBodyContent } from '@/features/public-cms/components/CmsBodyContent';
import { cn } from '@/lib/utils';

type MissionVisionSectionProps = {
  entries: CmsPublicPage[];
};

const cardIcons = [TargetIcon, TelescopeIcon];

export function MissionVisionSection({ entries }: MissionVisionSectionProps) {
  if (entries.length === 0) return null;

  const intro = entries.find((entry) => entry.slug === 'intro') ?? null;
  const cards = entries.filter((entry) => entry.slug !== 'intro');
  const displayCards = cards.length > 0 ? cards : entries;

  return (
    <SectionShell
      id="mission"
      variant="muted"
      eyebrow={intro?.heading ?? displayCards[0]?.heading ?? undefined}
      title={intro?.title ?? displayCards[0]?.title}
      description={intro?.subheading ?? undefined}
    >
      <div className={cn('grid gap-6', displayCards.length > 1 ? 'md:grid-cols-2' : 'max-w-3xl mx-auto')}>
        {displayCards.map((entry, index) => {
          const Icon = cardIcons[index] ?? TargetIcon;

          return (
            <article
              key={entry.id}
              className="group rounded-2xl border bg-card p-8 shadow-card transition-all duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-elevated"
            >
              <div className="inline-flex rounded-xl bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-6" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-2xl font-bold tracking-tight">{entry.title}</h3>
              {entry.subheading ? (
                <p className="mt-2 text-sm font-medium text-secondary">{entry.subheading}</p>
              ) : null}
              <CmsBodyContent body={entry.body} className="mt-4 text-sm md:text-base" />
            </article>
          );
        })}
      </div>
      {intro?.body ? (
        <div className="mx-auto mt-8 max-w-3xl text-center">
          <CmsBodyContent body={intro.body} className="text-muted-foreground" />
        </div>
      ) : null}
      <div className="mt-10 text-center">
        <AppButton asChild variant="primary">
          <Link to="/mission">{intro?.title ?? displayCards[displayCards.length - 1]?.title}</Link>
        </AppButton>
      </div>
    </SectionShell>
  );
}
