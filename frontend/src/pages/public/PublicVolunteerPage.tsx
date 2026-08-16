import { HeartHandshakeIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { VolunteerForm } from '@/features/volunteer/components/VolunteerForm';
import { PageContainer } from '@/features/public-site/components/PageContainer';
import { PublicPageHero, PublicPageShell } from '@/features/public-site/components/PublicPageShell';

export function PublicVolunteerPage() {
  const { t } = useTranslation();

  return (
    <>
      <PublicPageHero
        eyebrow={t('volunteer.eyebrow')}
        title={t('volunteer.title')}
        description={t('volunteer.description')}
      />

      <PublicPageShell>
        <PageContainer className="mx-auto max-w-2xl space-y-8 !px-0 !py-0">
          <div className="rounded-xl border bg-card p-6 shadow-card md:p-8">
            <div className="mb-6 flex items-start gap-3">
              <div className="inline-flex rounded-full bg-primary/10 p-3 text-primary">
                <HeartHandshakeIcon className="size-6" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-semibold tracking-tight">{t('volunteer.formTitle')}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t('volunteer.formIntro')}</p>
              </div>
            </div>
            <VolunteerForm />
          </div>
        </PageContainer>
      </PublicPageShell>
    </>
  );
}
