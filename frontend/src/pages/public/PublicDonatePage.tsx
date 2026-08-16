import { useRef } from 'react';
import { DonateForm } from '@/features/donation/components/DonateForm';
import { DonateRecentSection } from '@/features/donation/components/DonateRecentSection';
import { DonateTopDonorsSection } from '@/features/donation/components/DonateTopDonorsSection';
import { PageContainer } from '@/features/public-site/components/PageContainer';
import { PublicPageShell } from '@/features/public-site/components/PublicPageShell';

export function PublicDonatePage() {
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <PublicPageShell>
      <PageContainer className="space-y-10 py-10 md:space-y-12 md:py-14">
        <div ref={formRef} className="mx-auto max-w-xl scroll-mt-24">
          <DonateForm />
        </div>

        <div className="mx-auto max-w-xl space-y-10">
          <DonateRecentSection onDonateClick={scrollToForm} />
          <DonateTopDonorsSection onDonateClick={scrollToForm} />
        </div>
      </PageContainer>
    </PublicPageShell>
  );
}
