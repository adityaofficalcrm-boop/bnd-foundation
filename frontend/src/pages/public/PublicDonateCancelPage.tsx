import { Link } from 'react-router-dom';
import { XCircleIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AppButton } from '@/components/app';
import { PageContainer } from '@/features/public-site/components/PageContainer';
import { PublicPageShell } from '@/features/public-site/components/PublicPageShell';

export function PublicDonateCancelPage() {
  const { t } = useTranslation();

  return (
    <PublicPageShell>
      <PageContainer className="py-10 md:py-14">
        <div className="mx-auto max-w-lg rounded-xl border bg-card p-8 text-center shadow-card">
          <div className="mx-auto inline-flex rounded-full bg-muted p-3 text-muted-foreground">
            <XCircleIcon className="size-8" aria-hidden="true" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">{t('donatePage.cancelTitle')}</h1>
          <p className="mt-3 text-sm text-muted-foreground">{t('donatePage.cancelBody')}</p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <AppButton asChild variant="accent">
              <Link to="/donate">{t('donatePage.tryAgain')}</Link>
            </AppButton>
            <AppButton asChild variant="outline">
              <Link to="/">{t('donatePage.backHome')}</Link>
            </AppButton>
          </div>
        </div>
      </PageContainer>
    </PublicPageShell>
  );
}
