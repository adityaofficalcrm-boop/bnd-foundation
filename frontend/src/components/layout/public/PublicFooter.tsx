import {
  FacebookIcon,
  LinkedinIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  YoutubeIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PublicBrandLogo } from '@/components/layout/public/PublicBrandLogo';
import { FOOTER_QUICK_LINKS } from '@/config/footer-links';
import { SITE_ASSETS } from '@/config/site-assets';
import { CMS_SECTIONS } from '@/features/cms/types/cms.types';
import { CmsBodyContent } from '@/features/public-cms/components/CmsBodyContent';
import { usePublicCmsAll, usePublicCmsSection } from '@/features/public-cms/hooks/usePublicCmsQueries';
import { usePublicNavLabel } from '@/features/public-cms/hooks/usePublicNavLabel';
import { PageContainer } from '@/features/public-site/components/PageContainer';
import { Skeleton } from '@/components/ui/skeleton';
import { resolveGoogleMapsUrl } from '@/lib/google-maps-url';

const addressLinkClassName =
  'whitespace-pre-line break-words transition-colors hover:text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary';

function FooterAddressLink({
  body,
  title,
  mapsUrl,
}: {
  body?: string | null;
  title: string;
  mapsUrl?: string | null;
}) {
  const addressText = body?.trim() || title;
  const href = resolveGoogleMapsUrl(addressText, mapsUrl);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={addressLinkClassName}
    >
      {addressText}
    </a>
  );
}

function FooterQuickLink({
  item,
  pages,
}: {
  item: (typeof FOOTER_QUICK_LINKS)[number];
  pages: Array<{ slug: string; title: string }>;
}) {
  const label = usePublicNavLabel(pages, item.navSlug, item.fallbackLabel);

  return (
    <li>
      <Link
        to={item.path}
        className="text-sm text-primary-foreground/90 transition-colors hover:text-accent"
      >
        {label}
      </Link>
    </li>
  );
}

const socialLinks = [
  { key: 'socialFacebook' as const, Icon: FacebookIcon, labelKey: 'social.facebook' },
  { key: 'socialLinkedin' as const, Icon: LinkedinIcon, labelKey: 'social.linkedin' },
  { key: 'socialYoutube' as const, Icon: YoutubeIcon, labelKey: 'social.youtube' },
];

export function PublicFooter() {
  const { t, i18n } = useTranslation();
  const { data: footerEntries = [], isLoading } = usePublicCmsSection(CMS_SECTIONS.FOOTER);
  const { data: allPages = [] } = usePublicCmsAll();
  const { data: contactEntries = [] } = usePublicCmsSection(CMS_SECTIONS.CONTACT_INFO);

  const footerEntry = footerEntries.find((entry) => entry.slug === 'footer-main') ?? footerEntries[0];
  const officeAddresses = footerEntries
    .filter((entry) => entry.slug.startsWith('address-'))
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const touchAddresses = footerEntries
    .filter((entry) => entry.slug.startsWith('footer-touch-'))
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const meta = footerEntry?.meta;
  const contactMeta = contactEntries[0]?.meta;
  const phone = contactMeta?.phone ?? meta?.phone;
  const email = contactMeta?.email ?? meta?.email;
  const isNepali = i18n.language.startsWith('ne');
  const copyright = isNepali
    ? t('footer.copyright', { year: new Date().getFullYear() })
    : (meta?.copyright ?? t('footer.copyright', { year: new Date().getFullYear() }));
  const supportCredit = isNepali
    ? t('footer.supportCredit', { defaultValue: meta?.supportCredit ?? '' })
    : meta?.supportCredit;

  return (
    <footer className="border-t border-primary-foreground/10 bg-primary text-primary-foreground">
      <PageContainer className="py-12 md:py-14">
        <div className="grid gap-10 border-b border-primary-foreground/10 pb-10 lg:grid-cols-[1.4fr_1fr] lg:items-start lg:gap-12">
          <div className="space-y-5">
            <PublicBrandLogo variant="white" className="h-12 sm:h-14" />
            {isLoading ? (
              <Skeleton className="h-28 w-full max-w-2xl bg-white/10" />
            ) : footerEntry ? (
              <CmsBodyContent
                body={footerEntry.body}
                className="max-w-2xl text-sm leading-relaxed text-primary-foreground/80 [&_p+_p]:mt-3 [&_p:last-child]:text-base [&_p:last-child]:font-semibold [&_p:last-child]:text-primary-foreground [&_strong]:font-bold [&_strong]:text-primary-foreground"
              />
            ) : null}
          </div>

          <div className="flex flex-col items-start gap-5 lg:items-end">
            <img
              src={SITE_ASSETS.acncLogo}
              alt={t('footer.acncAlt')}
              className="h-16 w-auto rounded bg-white p-1.5"
            />
            <div className="flex flex-wrap items-center gap-2">
              <img src={SITE_ASSETS.torresFlag} alt="" className="h-8 w-auto rounded-sm" />
              <img src={SITE_ASSETS.aboriginalFlag} alt="" className="h-8 w-auto rounded-sm" />
              <img src={SITE_ASSETS.australiaFlag} alt="" className="h-8 w-auto rounded-sm" />
            </div>
          </div>
        </div>

        <div className="grid gap-10 py-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          <div>
            <h2 className="text-sm font-bold tracking-wide uppercase">{t('footer.quickLinks')}</h2>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_QUICK_LINKS.map((item) => (
                <FooterQuickLink
                  key={`${item.path}-${item.fallbackLabel}`}
                  item={item}
                  pages={allPages}
                />
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold tracking-wide uppercase">{t('footer.addresses')}</h2>
            {officeAddresses.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {officeAddresses.map((entry) => (
                  <li key={entry.id} className="flex gap-2.5 text-sm text-primary-foreground/90">
                    <MapPinIcon
                      className="mt-0.5 size-4 shrink-0 text-primary-foreground/80"
                      aria-hidden="true"
                    />
                    <FooterAddressLink
                      body={entry.body}
                      title={entry.title}
                      mapsUrl={entry.meta?.ctaUrl}
                    />
                  </li>
                ))}
              </ul>
            ) : isLoading ? (
              <Skeleton className="mt-4 h-24 w-full bg-white/10" />
            ) : (
              <p className="mt-4 text-sm text-primary-foreground/75">
                Add <code className="text-xs">address-*</code> entries in Footer CMS.
              </p>
            )}
          </div>

          <div className="md:col-span-2 lg:col-span-1">
            <h2 className="text-sm font-bold tracking-wide uppercase">{t('footer.getInTouch')}</h2>
            <ul className="mt-4 space-y-3 text-sm text-primary-foreground/90">
              {touchAddresses.map((entry) => (
                <li key={entry.id} className="flex gap-2.5">
                  <MapPinIcon
                    className="mt-0.5 size-4 shrink-0 text-primary-foreground/80"
                    aria-hidden="true"
                  />
                  <FooterAddressLink
                    body={entry.body}
                    title={entry.title}
                    mapsUrl={entry.meta?.ctaUrl}
                  />
                </li>
              ))}
              {phone ? (
                <li>
                  <a
                    href={`tel:${phone}`}
                    className="inline-flex items-center gap-2.5 hover:text-accent"
                  >
                    <PhoneIcon
                      className="size-4 shrink-0 text-primary-foreground/80"
                      aria-hidden="true"
                    />
                    {phone}
                  </a>
                </li>
              ) : null}
              {email ? (
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center gap-2.5 hover:text-accent"
                  >
                    <MailIcon
                      className="size-4 shrink-0 text-primary-foreground/80"
                      aria-hidden="true"
                    />
                    {email}
                  </a>
                </li>
              ) : null}
            </ul>

            <h2 className="mt-8 text-sm font-bold tracking-wide uppercase">{t('footer.followUs')}</h2>
            {meta && socialLinks.some(({ key }) => meta[key]) ? (
              <div className="mt-4 flex flex-wrap gap-3">
                {socialLinks.map(({ key, Icon, labelKey }) => {
                  const url = meta[key];
                  if (!url) return null;

                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex size-10 items-center justify-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground transition-all hover:border-accent hover:bg-accent hover:text-accent-foreground"
                      aria-label={t(labelKey)}
                    >
                      <Icon className="size-4" />
                    </a>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-1 border-t border-primary-foreground/10 pt-6 text-center text-sm text-primary-foreground/80">
          <p>{copyright}</p>
          {supportCredit ? (
            <p className="text-primary-foreground/65">{supportCredit}</p>
          ) : null}
        </div>
      </PageContainer>
    </footer>
  );
}
