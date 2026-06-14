import { FacebookIcon, HeartHandshakeIcon, InstagramIcon, LinkedinIcon, TwitterIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CMS_SECTIONS } from '@/features/cms/types/cms.types';
import { CmsBodyContent } from '@/features/public-cms/components/CmsBodyContent';
import { usePublicCmsAll, usePublicCmsSection } from '@/features/public-cms/hooks/usePublicCmsQueries';
import { env } from '@/config/env';
import { formatPathLabel, PUBLIC_NAV_ITEMS } from '@/config/public-nav';
import { PageContainer } from '@/features/public-site/components/PageContainer';
import { Skeleton } from '@/components/ui/skeleton';

const socialIcons = {
  socialFacebook: FacebookIcon,
  socialTwitter: TwitterIcon,
  socialInstagram: InstagramIcon,
  socialLinkedin: LinkedinIcon,
} as const;

export function PublicFooter() {
  const { data: footerEntries = [], isLoading } = usePublicCmsSection(CMS_SECTIONS.FOOTER);
  const { data: allPages = [] } = usePublicCmsAll();
  const footerEntry = footerEntries[0];
  const meta = footerEntry?.meta;

  return (
    <footer className="border-t bg-[#0b2742] text-primary-foreground">
      <PageContainer className="py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-4 lg:col-span-5">
            <div className="inline-flex items-center gap-2">
              <div className="rounded-lg bg-white/10 p-2">
                <HeartHandshakeIcon className="size-5" aria-hidden="true" />
              </div>
              <p className="text-xl font-bold">{env.VITE_APP_NAME}</p>
            </div>
            {isLoading ? (
              <Skeleton className="h-20 w-full max-w-md bg-white/10" />
            ) : footerEntry ? (
              <CmsBodyContent body={footerEntry.body} className="max-w-md text-sm text-primary-foreground/80" />
            ) : null}
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-sm font-semibold tracking-wide uppercase text-primary-foreground/70">Explore</h2>
            <ul className="mt-4 space-y-2.5">
              {PUBLIC_NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                  >
                    {allPages.find((entry) => entry.section === item.section)?.title ??
                      formatPathLabel(item.path)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h2 className="text-sm font-semibold tracking-wide uppercase text-primary-foreground/70">Connect</h2>
            {meta && (meta.socialFacebook || meta.socialTwitter || meta.socialInstagram || meta.socialLinkedin) ? (
              <div className="mt-4 flex flex-wrap gap-3">
                {(Object.entries(socialIcons) as [keyof typeof socialIcons, typeof FacebookIcon][]).map(
                  ([key, Icon]) => {
                    const url = meta[key];
                    if (!url) return null;

                    return (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-primary-foreground/85 transition-all hover:border-accent hover:bg-accent hover:text-accent-foreground"
                        aria-label={key.replace('social', '')}
                      >
                        <Icon className="size-4" />
                      </a>
                    );
                  },
                )}
              </div>
            ) : isLoading ? (
              <Skeleton className="mt-4 h-11 w-44 bg-white/10" />
            ) : null}

            {(meta?.email || meta?.phone) && (
              <div className="mt-6 space-y-2 text-sm text-primary-foreground/80">
                {meta.email ? (
                  <a href={`mailto:${meta.email}`} className="block hover:text-primary-foreground">
                    {meta.email}
                  </a>
                ) : null}
                {meta.phone ? (
                  <a href={`tel:${meta.phone}`} className="block hover:text-primary-foreground">
                    {meta.phone}
                  </a>
                ) : null}
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-primary-foreground/70">
          {meta?.copyright ?? footerEntry?.title ?? env.VITE_APP_NAME}
        </div>
      </PageContainer>
    </footer>
  );
}
