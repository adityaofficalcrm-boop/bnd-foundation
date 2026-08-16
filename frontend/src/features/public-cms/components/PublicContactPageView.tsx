import { NAV_SLUGS } from '@/config/public-nav';
import { CMS_SECTIONS } from '@/features/cms/types/cms.types';
import { PublicCmsState } from '@/features/public-cms/components/PublicCmsState';
import { usePublicCmsAll, usePublicCmsSection } from '@/features/public-cms/hooks/usePublicCmsQueries';
import { filterPublicContentEntries } from '@/features/public-cms/utils/cms-entry-filters';
import { usePublicNavLabel } from '@/features/public-cms/hooks/usePublicNavLabel';
import { ContactDetailCards } from '@/features/public-site/components/contact/ContactDetailCards';
import { ContactMapFormSection } from '@/features/public-site/components/contact/ContactMapFormSection';
import { ContactPageIntro } from '@/features/public-site/components/contact/ContactPageIntro';
import { PageContainer } from '@/features/public-site/components/PageContainer';
import { useTranslation } from 'react-i18next';

const CONTACT_MAIN_SLUG = 'contact-main';

export function PublicContactPageView() {
  const { t } = useTranslation();
  const { data: entries = [], isLoading, isError, refetch } = usePublicCmsSection(CMS_SECTIONS.CONTACT_INFO);
  const { data: allPages = [] } = usePublicCmsAll();

  const contentEntries = filterPublicContentEntries(entries);
  const main = contentEntries.find((entry) => entry.slug === CONTACT_MAIN_SLUG) ?? contentEntries[0] ?? null;
  const pageTitle = usePublicNavLabel(allPages, NAV_SLUGS.contact, t('nav.contact'));
  const introTitle = main?.title?.trim() || pageTitle;
  const introDescription =
    main?.subheading?.trim() ||
    main?.body?.trim() ||
    t('contact.introFallback');
  const phone = main?.meta?.phone;
  const email = main?.meta?.email;
  const address = main?.meta?.address;
  const mapsUrl = main?.meta?.ctaUrl;
  const hasContent = Boolean(main || phone || email || address);

  return (
    <PublicCmsState
      isLoading={isLoading}
      isError={isError}
      isEmpty={!hasContent}
      onRetry={() => void refetch()}
      emptyDescription={t('contact.emptyCms')}
    >
      <PageContainer className="space-y-10 py-10 md:space-y-14 md:py-14">
        <ContactPageIntro title={introTitle} description={introDescription} />
        <ContactDetailCards phone={phone} email={email} address={address} mapsUrl={mapsUrl} />
        <ContactMapFormSection address={address} mapsUrl={mapsUrl} />
      </PageContainer>
    </PublicCmsState>
  );
}
