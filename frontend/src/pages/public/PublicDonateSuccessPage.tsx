import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2Icon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AppButton, LoadingSkeleton } from '@/components/app';
import { useConfirmDonation } from '@/features/donation/hooks/useDonationQueries';
import { formatAudFromCents } from '@/lib/currency';
import { PageContainer } from '@/features/public-site/components/PageContainer';
import { PublicPageShell } from '@/features/public-site/components/PublicPageShell';

export function PublicDonateSuccessPage() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const sessionId = params.get('session_id') ?? undefined;
  const { data, isLoading, isError, error } = useConfirmDonation(sessionId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PublicPageShell>
      <PageContainer className="py-10 md:py-14">
        <div className="mx-auto max-w-lg rounded-xl border bg-card p-8 text-center shadow-card">
          {isLoading ? (
            <LoadingSkeleton rows={4} />
          ) : isError || !data ? (
            <>
              <h1 className="text-2xl font-bold tracking-tight">{t('donatePage.successPendingTitle')}</h1>
              <p className="mt-3 text-sm text-muted-foreground">
                {error
                  ? t('donatePage.successPendingError')
                  : t('donatePage.successMissingSession')}
              </p>
              <AppButton asChild variant="accent" className="mt-6">
                <Link to="/donate">{t('donatePage.backDonate')}</Link>
              </AppButton>
            </>
          ) : (
            <>
              <div className="mx-auto inline-flex rounded-full bg-success/15 p-3 text-success">
                <CheckCircle2Icon className="size-8" aria-hidden="true" />
              </div>
              <h1 className="mt-4 text-2xl font-bold tracking-tight">{t('donatePage.successTitle')}</h1>
              <p className="mt-3 text-sm text-muted-foreground">{t('donatePage.successBody')}</p>
              <p className="mt-4 text-lg font-semibold text-foreground">
                {formatAudFromCents(data.amountCents)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t('donatePage.successReceipt', { email: data.email })}
              </p>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
                <AppButton asChild variant="accent">
                  <Link to="/donate">{t('donatePage.donateAgain')}</Link>
                </AppButton>
                <AppButton asChild variant="outline">
                  <Link to="/">{t('donatePage.backHome')}</Link>
                </AppButton>
              </div>
            </>
          )}
        </div>
      </PageContainer>
    </PublicPageShell>
  );
}
