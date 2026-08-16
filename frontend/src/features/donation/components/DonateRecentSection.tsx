import { HandCoinsIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AppButton } from '@/components/app';
import { LoadingSkeleton } from '@/components/app';
import { useRecentDonations } from '@/features/donation/hooks/useDonationQueries';
import { formatAudFromCents } from '@/lib/currency';

type DonateRecentSectionProps = {
  onDonateClick: () => void;
};

export function DonateRecentSection({ onDonateClick }: DonateRecentSectionProps) {
  const { t } = useTranslation();
  const { data: donations = [], isLoading, isError } = useRecentDonations();

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold tracking-tight text-foreground">{t('donate.recentTitle')}</h2>

      <div className="rounded-xl border bg-card p-6 shadow-card md:p-8">
        {isLoading ? (
          <LoadingSkeleton rows={3} />
        ) : isError ? (
          <p className="text-sm text-muted-foreground">{t('donatePage.recentError')}</p>
        ) : donations.length === 0 ? (
          <div className="flex flex-col items-center py-4 text-center">
            <HandCoinsIcon className="size-10 text-muted-foreground/60" aria-hidden="true" />
            <p className="mt-4 max-w-md text-sm text-muted-foreground">{t('donatePage.recentEmpty')}</p>
            <AppButton type="button" variant="outline" className="mt-5" onClick={onDonateClick}>
              {t('donatePage.beTheFirst')}
            </AppButton>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {donations.map((donation) => (
              <li
                key={donation.id}
                className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="font-medium text-foreground">{donation.donorName}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(donation.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="font-semibold text-primary">
                  {formatAudFromCents(donation.amountCents)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
