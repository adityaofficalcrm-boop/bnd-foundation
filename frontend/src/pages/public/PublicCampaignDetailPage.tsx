import { Link, useParams } from 'react-router-dom';
import { ArrowLeftIcon, MegaphoneIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AppButton, LoadingSkeleton } from '@/components/app';
import { usePublicCampaign } from '@/features/campaign/hooks/useCampaignQueries';
import { CAMPAIGN_STATUSES } from '@/features/campaign/types/campaign.types';
import { PageContainer } from '@/features/public-site/components/PageContainer';
import { PublicPageShell } from '@/features/public-site/components/PublicPageShell';
import { formatAudFromCents } from '@/lib/currency';

export function PublicCampaignDetailPage() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const { data: campaign, isLoading, isError } = usePublicCampaign(slug);

  if (isLoading) {
    return (
      <PublicPageShell>
        <LoadingSkeleton rows={6} />
      </PublicPageShell>
    );
  }

  if (isError || !campaign) {
    return (
      <PublicPageShell>
        <div className="mx-auto max-w-lg rounded-xl border bg-card p-8 text-center">
          <h1 className="text-xl font-semibold">{t('campaigns.notFoundTitle')}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t('campaigns.notFoundBody')}</p>
          <AppButton asChild variant="outline" className="mt-6">
            <Link to="/campaigns">{t('campaigns.allCampaigns')}</Link>
          </AppButton>
        </div>
      </PublicPageShell>
    );
  }

  const percent =
    campaign.goalAmountCents > 0
      ? Math.min(100, Math.round((campaign.raisedAmountCents / campaign.goalAmountCents) * 100))
      : 0;
  const isActive = campaign.status === CAMPAIGN_STATUSES.ACTIVE;

  return (
    <PublicPageShell>
      <PageContainer className="mx-auto max-w-3xl space-y-8 !px-0 !py-0">
        <AppButton asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
          <Link to="/campaigns">
            <ArrowLeftIcon className="size-4" />
            {t('campaigns.allCampaigns')}
          </Link>
        </AppButton>

        {campaign.coverImageUrl ? (
          <div className="aspect-[16/9] overflow-hidden rounded-xl bg-muted">
            <img
              src={campaign.coverImageUrl}
              alt=""
              className="size-full object-cover"
            />
          </div>
        ) : (
          <div className="flex aspect-[16/9] items-center justify-center rounded-xl bg-primary/5 text-primary">
            <MegaphoneIcon className="size-12 opacity-60" aria-hidden="true" />
          </div>
        )}

        <div>
          <p className="text-xs font-semibold tracking-wider text-secondary uppercase">
            {isActive ? t('campaigns.statusActive') : t('campaigns.statusCompleted')}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{campaign.title}</h1>
          <p className="mt-4 whitespace-pre-wrap text-muted-foreground">{campaign.description}</p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-card">
          <div className="mb-3 flex items-center justify-between gap-2 text-sm">
            <span className="font-semibold text-foreground">
              {t('campaigns.raised', { amount: formatAudFromCents(campaign.raisedAmountCents) })}
            </span>
            <span className="text-muted-foreground">
              {t('campaigns.goal', { amount: formatAudFromCents(campaign.goalAmountCents) })}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-accent" style={{ width: `${percent}%` }} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {t('campaigns.percentOfGoal', { percent })}
          </p>

          {isActive ? (
            <AppButton asChild variant="accent" size="lg" className="mt-6 w-full font-semibold">
              <Link to={`/donate?campaign=${campaign.slug}`}>{t('campaigns.donateToCampaign')}</Link>
            </AppButton>
          ) : null}
        </div>
      </PageContainer>
    </PublicPageShell>
  );
}
