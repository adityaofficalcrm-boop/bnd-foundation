import { ExternalLinkIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';
import { SectionShell } from '@/features/public-site/components/SectionShell';

type FacebookUpdatesSectionProps = {
  entry?: CmsPublicPage | null;
};

/** Facebook Page Plugin never renders wider than 500px — wider boxes leave empty space. */
const FACEBOOK_MAX_WIDTH = 500;
const EMBED_HEIGHT = 620;

function buildFacebookEmbedUrl(pageUrl: string, width: number): string {
  const params = new URLSearchParams({
    href: pageUrl,
    tabs: 'timeline',
    width: String(Math.min(FACEBOOK_MAX_WIDTH, Math.max(280, Math.floor(width)))),
    height: String(EMBED_HEIGHT),
    small_header: 'false',
    adapt_container_width: 'true',
    hide_cover: 'false',
    show_facepile: 'true',
  });

  return `https://www.facebook.com/plugins/page.php?${params.toString()}`;
}

export function FacebookUpdatesSection({ entry }: FacebookUpdatesSectionProps) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [embedWidth, setEmbedWidth] = useState(0);

  const facebookUrl = entry?.meta?.socialFacebook?.trim() || entry?.meta?.ctaUrl?.trim() || '';
  const heading =
    entry?.title?.trim() ||
    entry?.body?.trim() ||
    t('facebook.previewHint');

  useEffect(() => {
    const node = containerRef.current;
    if (!node || !facebookUrl) return;

    const updateWidth = () => {
      const nextWidth = Math.min(FACEBOOK_MAX_WIDTH, Math.floor(node.getBoundingClientRect().width));
      setEmbedWidth((current) => (current === nextWidth ? current : nextWidth));
    };

    updateWidth();

    let resizeTimer: number | undefined;
    const observer = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(updateWidth, 200);
    });
    observer.observe(node);

    return () => {
      window.clearTimeout(resizeTimer);
      observer.disconnect();
    };
  }, [facebookUrl]);

  const embedSrc = useMemo(() => {
    if (!facebookUrl || embedWidth <= 0) return '';
    return buildFacebookEmbedUrl(facebookUrl, embedWidth);
  }, [facebookUrl, embedWidth]);

  if (!entry) return null;

  return (
    <SectionShell id="facebook-updates" className="bg-background pt-0" animate={false}>
      <div className="mx-auto w-full max-w-3xl space-y-6 text-center">
        <h2 className="text-xl font-semibold text-primary md:text-2xl">{heading}</h2>

        {facebookUrl ? (
          <div
            ref={containerRef}
            className="mx-auto w-full max-w-[500px] overflow-hidden rounded-2xl border border-border bg-card shadow-card"
          >
            {embedSrc ? (
              <iframe
                title={t('facebook.embedTitle')}
                src={embedSrc}
                className="block w-full border-0"
                style={{ height: EMBED_HEIGHT }}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              />
            ) : (
              <div
                className="flex items-center justify-center text-sm text-muted-foreground"
                style={{ height: EMBED_HEIGHT }}
              >
                {t('facebook.loading')}
              </div>
            )}
          </div>
        ) : (
          <div className="mx-auto max-w-[500px] rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-muted-foreground">
            <p className="text-sm">{t('facebook.missingUrl')}</p>
          </div>
        )}

        {facebookUrl ? (
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            {t('facebook.openPage')}
            <ExternalLinkIcon className="size-4" aria-hidden="true" />
          </a>
        ) : null}
      </div>
    </SectionShell>
  );
}
