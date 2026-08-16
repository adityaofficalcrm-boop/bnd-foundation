import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppButton } from '@/components/app';
import { PublicDonateButton } from '@/components/layout/public/PublicDonateButton';
import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';
import { CountUpStat } from '@/features/public-site/components/CountUpStat';

type AboutOrgStatsBarProps = {
  stats: CmsPublicPage[];
  introText?: string;
};

export function AboutOrgStatsBar({ stats, introText }: AboutOrgStatsBarProps) {
  const { t } = useTranslation();
  const sortedStats = [...stats].sort((a, b) => a.sortOrder - b.sortOrder);

  if (sortedStats.length === 0) {
    return null;
  }

  return (
    <section className="space-y-8">
      {introText ? (
        <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-muted-foreground md:text-lg">
          {introText}
        </p>
      ) : null}

      <div className="relative overflow-hidden rounded-2xl bg-primary">
        <div
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              'repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(255,255,255,0.12) 8px, rgba(255,255,255,0.12) 16px)',
          }}
          aria-hidden="true"
        />
        <div className="relative grid grid-cols-2 divide-y divide-white/15 md:grid-cols-4 md:divide-x md:divide-y-0">
          {sortedStats.map((metric) => {
            const statValue = metric.subheading ?? metric.title ?? '0';
            const statLabel = metric.subheading ? metric.title : metric.heading;

            return (
              <div key={metric.id} className="px-6 py-8 text-center text-primary-foreground">
                <p className="text-4xl font-bold tracking-tight md:text-5xl">
                  <CountUpStat value={statValue} />
                </p>
                <p className="mt-2 text-sm font-medium uppercase tracking-wide text-primary-foreground/90">
                  {statLabel}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <PublicDonateButton size="lg" />
        <AppButton asChild size="lg" variant="outline">
          <Link to="/contact">{t('cta.getInTouch')}</Link>
        </AppButton>
      </div>
    </section>
  );
}
