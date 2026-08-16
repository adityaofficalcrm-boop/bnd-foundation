import { Link } from 'react-router-dom';
import { MegaphoneIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AppButton, LoadingSkeleton } from '@/components/app';
import { PublicDonateButton } from '@/components/layout/public/PublicDonateButton';
import { usePublicCampaigns } from '@/features/campaign/hooks/useCampaignQueries';
import { CAMPAIGN_STATUSES, type Campaign } from '@/features/campaign/types/campaign.types';
import { PageContainer } from '@/features/public-site/components/PageContainer';
import { PublicPageHero, PublicPageShell } from '@/features/public-site/components/PublicPageShell';
import { formatAudFromCents } from '@/lib/currency';
import { cn } from '@/lib/utils';

function progressPercent(campaign: Campaign): number {
  if (campaign.goalAmountCents <= 0) return 0;
  return Math.min(100, Math.round((campaign.raisedAmountCents / campaign.goalAmountCents) * 100));
}

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const { t } = useTranslation();
  const percent = progressPercent(campaign);
  const isActive = campaign.status === CAMPAIGN_STATUSES.ACTIVE;

  return (
    <article className="overflow-hidden rounded-xl border bg-card shadow-card">
      {campaign.coverImageUrl ? (
        <div className="aspect-[16/9] overflow-hidden bg-muted">
          <img
            src={campaign.coverImageUrl}
            alt=""
            className="size-full object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="flex aspect-[16/9] items-center justify-center bg-primary/5 text-primary">
          <MegaphoneIcon className="size-10 opacity-60" aria-hidden="true" />
        </div>
      )}

      <div className="space-y-4 p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
              isActive ? 'bg-success/15 text-success' : 'bg-muted text-muted-foreground',
            )}
          >
            {isActive ? t('campaigns.statusActive') : t('campaigns.statusCompleted')}
          </span>
        </div>

        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            <Link to={`/campaigns/${campaign.slug}`} className="hover:text-primary">
              {campaign.title}
            </Link>
          </h2>
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{campaign.description}</p>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-2 text-sm">
            <span className="font-medium text-foreground">
              {t('campaigns.raised', { amount: formatAudFromCents(campaign.raisedAmountCents) })}
            </span>
            <span className="text-muted-foreground">
              {t('campaigns.goal', { amount: formatAudFromCents(campaign.goalAmountCents) })}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {t('campaigns.percentOfGoal', { percent })}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <AppButton asChild variant="outline" size="sm">
            <Link to={`/campaigns/${campaign.slug}`}>{t('campaigns.viewCampaign')}</Link>
          </AppButton>
          {isActive ? (
            <AppButton asChild variant="accent" size="sm">
              <Link to={`/donate?campaign=${campaign.slug}`}>{t('campaigns.donate')}</Link>
            </AppButton>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function PublicCampaignsPage() {
  const { t } = useTranslation();
  const { data: campaigns = [], isLoading, isError, refetch } = usePublicCampaigns();

  const active = campaigns.filter((c) => c.status === CAMPAIGN_STATUSES.ACTIVE);
  const completed = campaigns.filter((c) => c.status === CAMPAIGN_STATUSES.COMPLETED);

  return (
    <>
      <PublicPageHero
        eyebrow={t('campaigns.eyebrow')}
        title={t('campaigns.title')}
        description={t('campaigns.description')}
      />

      <PublicPageShell>
        <PageContainer className="space-y-12 !px-0 !py-0">
          {isLoading ? (
            <LoadingSkeleton rows={4} />
          ) : isError ? (
            <div className="rounded-xl border bg-card p-8 text-center">
              <p className="text-sm text-muted-foreground">{t('campaigns.loadError')}</p>
              <AppButton variant="outline" className="mt-4" onClick={() => void refetch()}>
                {t('common.tryAgain')}
              </AppButton>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="rounded-xl border bg-card p-10 text-center shadow-card">
              <MegaphoneIcon className="mx-auto size-10 text-muted-foreground/60" />
              <h2 className="mt-4 text-xl font-semibold">{t('campaigns.emptyTitle')}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{t('campaigns.emptyBody')}</p>
              <PublicDonateButton className="mt-6" />
            </div>
          ) : (
            <>
              {active.length > 0 ? (
                <section className="space-y-6">
                  <h2 className="text-2xl font-bold tracking-tight">{t('campaigns.active')}</h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    {active.map((campaign) => (
                      <CampaignCard key={campaign.id} campaign={campaign} />
                    ))}
                  </div>
                </section>
              ) : null}

              {completed.length > 0 ? (
                <section className="space-y-6">
                  <h2 className="text-2xl font-bold tracking-tight">{t('campaigns.completed')}</h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    {completed.map((campaign) => (
                      <CampaignCard key={campaign.id} campaign={campaign} />
                    ))}
                  </div>
                </section>
              ) : null}
            </>
          )}
        </PageContainer>
      </PublicPageShell>
    </>
  );
}
