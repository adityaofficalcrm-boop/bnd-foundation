import { ArrowRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppButton } from '@/components/app';
import { CmsBodyContent } from '@/features/public-cms/components/CmsBodyContent';
import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';
import { CountUpStat } from '@/features/public-site/components/CountUpStat';
import { cn } from '@/lib/utils';

type AboutMissionVisionRowProps = {
  entry: CmsPublicPage;
  reverse?: boolean;
  stats?: CmsPublicPage[];
  showStats?: boolean;
  showActions?: boolean;
};

function InlineOrgStats({ stats }: { stats: CmsPublicPage[] }) {
  const sorted = [...stats].sort((a, b) => a.sortOrder - b.sortOrder);

  if (sorted.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-6 pt-2 sm:grid-cols-4 sm:gap-4">
      {sorted.map((metric) => {
        const statValue = metric.subheading ?? metric.title ?? '0';
        const statLabel = metric.subheading ? metric.title : metric.heading;

        return (
          <div key={metric.id}>
            <p className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              <CountUpStat value={statValue} />
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{statLabel}</p>
          </div>
        );
      })}
    </div>
  );
}

export function AboutMissionVisionRow({
  entry,
  reverse = false,
  stats = [],
  showStats = false,
  showActions = false,
}: AboutMissionVisionRowProps) {
  const { t } = useTranslation();
  const imageAlt = entry.title ?? entry.heading ?? '';

  const imageColumn = entry.imageUrl ? (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div
        className={cn(
          'absolute top-[10%] -z-10 hidden h-[78%] w-[58%] rounded-sm bg-primary md:block',
          reverse ? 'left-[6%] -rotate-[6deg]' : 'right-[6%] rotate-[6deg]',
        )}
        aria-hidden="true"
      />
      <img
        src={entry.imageUrl}
        alt={imageAlt}
        className="relative z-10 aspect-[4/5] w-full rounded-2xl object-cover shadow-elevated"
        loading="lazy"
      />
    </div>
  ) : null;

  const contentColumn = (
    <div className="space-y-5">
      {entry.heading ? (
        <p className="text-sm font-medium text-muted-foreground">{entry.heading}</p>
      ) : null}
      <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{entry.title}</h2>
      {entry.body ? (
        <CmsBodyContent body={entry.body} className="text-base leading-relaxed text-muted-foreground md:text-lg" />
      ) : null}
      {showStats ? <InlineOrgStats stats={stats} /> : null}
      {showActions ? (
        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
          <AppButton asChild size="lg" variant="accent" className="w-full font-semibold sm:w-auto">
            <Link to="/donate">
              {t('cta.donateNow')}
              <ArrowRightIcon className="size-4" aria-hidden="true" />
            </Link>
          </AppButton>
          <AppButton asChild size="lg" variant="outline" className="w-full sm:w-auto">
            <Link to="/contact">{t('cta.getInTouch')}</Link>
          </AppButton>
        </div>
      ) : null}
    </div>
  );

  if (!imageColumn) {
    return (
      <article className="mx-auto max-w-3xl">
        {contentColumn}
      </article>
    );
  }

  return (
    <article
      className={cn(
        'grid items-center gap-10 lg:grid-cols-2 lg:gap-14',
        reverse && 'lg:[&>*:first-child]:order-2',
      )}
    >
      {imageColumn}
      {contentColumn}
    </article>
  );
}
