import {
  FacebookIcon,
  LinkedinIcon,
  MailIcon,
  PhoneIcon,
  YoutubeIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CMS_SECTIONS } from '@/features/cms/types/cms.types';
import { usePublicCmsSection } from '@/features/public-cms/hooks/usePublicCmsQueries';
import { PageContainer } from '@/features/public-site/components/PageContainer';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const socialLinks = [
  { key: 'socialFacebook' as const, Icon: FacebookIcon, labelKey: 'social.facebook' },
  { key: 'socialLinkedin' as const, Icon: LinkedinIcon, labelKey: 'social.linkedin' },
  { key: 'socialYoutube' as const, Icon: YoutubeIcon, labelKey: 'social.youtube' },
];

const linkClassName =
  'inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary';

export function PublicTopBar() {
  const { t } = useTranslation();
  const { data: contactEntries = [], isLoading: contactLoading } = usePublicCmsSection(
    CMS_SECTIONS.CONTACT_INFO,
  );
  const { data: footerEntries = [], isLoading: footerLoading } = usePublicCmsSection(
    CMS_SECTIONS.FOOTER,
  );

  const contactMeta = contactEntries[0]?.meta;
  const footerMeta =
    footerEntries.find((entry) => entry.slug === 'footer-main')?.meta ?? footerEntries[0]?.meta;
  const phone = contactMeta?.phone;
  const email = contactMeta?.email;
  const isLoading = contactLoading || footerLoading;

  const visibleSocialLinks = socialLinks.filter(({ key }) => footerMeta?.[key]);

  if (isLoading) {
    return (
      <div className="border-b border-border bg-background">
        <PageContainer className="flex h-10 items-center justify-between gap-4">
          <Skeleton className="hidden h-3 w-56 sm:block" />
          <div className="ml-auto flex gap-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-36" />
          </div>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="border-b border-border bg-background text-foreground">
      <PageContainer
        className={cn(
          'flex min-h-10 flex-wrap items-center gap-x-4 gap-y-1 py-1.5',
          'text-[0.6875rem] sm:text-xs md:text-sm',
          visibleSocialLinks.length || phone || email ? 'justify-between' : 'justify-center sm:justify-start',
        )}
      >
        <p className="hidden text-muted-foreground sm:block">{t('topbar.welcome')}</p>

        <div className="flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-1 sm:ml-auto sm:w-auto sm:justify-end sm:gap-x-5">
          {visibleSocialLinks.length > 0 ? (
            <div className="flex items-center gap-3">
              {visibleSocialLinks.map(({ key, Icon, labelKey }) => {
                const href = footerMeta?.[key];
                if (!href) return null;

                return (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClassName}
                    aria-label={t(labelKey)}
                  >
                    <Icon className="size-3.5 shrink-0" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          ) : null}

          {phone ? (
            <a href={`tel:${phone}`} className={cn(linkClassName, 'max-w-full')}>
              <PhoneIcon className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{phone}</span>
            </a>
          ) : null}

          {email ? (
            <a href={`mailto:${email}`} className={cn(linkClassName, 'max-w-full')}>
              <MailIcon className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{email}</span>
            </a>
          ) : null}
        </div>
      </PageContainer>
    </div>
  );
}
