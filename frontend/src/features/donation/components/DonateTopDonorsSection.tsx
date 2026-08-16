import { UserIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AppButton } from '@/components/app';
import { LoadingSkeleton } from '@/components/app';
import { useTopDonors } from '@/features/donation/hooks/useDonationQueries';
import { formatAudFromCents } from '@/lib/currency';

type DonateTopDonorsSectionProps = {
  onDonateClick: () => void;
};

export function DonateTopDonorsSection({ onDonateClick }: DonateTopDonorsSectionProps) {
  const { t } = useTranslation();
  const { data: donors = [], isLoading, isError } = useTopDonors();

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold tracking-tight text-foreground">{t('donate.topDonorsTitle')}</h2>

      <div className="rounded-xl border bg-card p-6 shadow-card md:p-8">
        {isLoading ? (
          <LoadingSkeleton rows={3} />
        ) : isError ? (
          <p className="text-sm text-muted-foreground">{t('donatePage.topError')}</p>
        ) : donors.length === 0 ? (
          <div className="flex flex-col items-center py-4 text-center">
            <UserIcon className="size-10 text-muted-foreground/60" aria-hidden="true" />
            <p className="mt-4 max-w-md text-sm text-muted-foreground">{t('donatePage.topEmpty')}</p>
            <AppButton type="button" variant="outline" className="mt-5" onClick={onDonateClick}>
              {t('donatePage.beTheFirstDonor')}
            </AppButton>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {donors.map((donor) => (
              <li
                key={donor.email}
                className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="font-medium text-foreground">{donor.donorName}</p>
                  <p className="text-xs text-muted-foreground">
                    {t('donatePage.donationCount', { count: donor.donationCount })}
                  </p>
                </div>
                <p className="font-semibold text-primary">
                  {formatAudFromCents(donor.totalAmountCents)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
