import { ArrowRightIcon, HandHeartIcon, HandshakeIcon, HeartHandshakeIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppButton } from '@/components/app';
import { resolveCtaSectionImage } from '@/config/site-assets';
import { CmsBodyContent } from '@/features/public-cms/components/CmsBodyContent';
import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';
import { SectionShell } from '@/features/public-site/components/SectionShell';
import { cn } from '@/lib/utils';

type HomeCtaSectionProps = {
  ctaHeading?: CmsPublicPage | null;
  ctaCards: CmsPublicPage[];
  contactEntry?: CmsPublicPage | null;
};

function resolveCtaCardIcon(slug: string): LucideIcon {
  const normalized = slug.toLowerCase();

  if (normalized.includes('donate')) return HandHeartIcon;
  if (normalized.includes('volunteer')) return HeartHandshakeIcon;
  if (normalized.includes('involv')) return HandshakeIcon;

  return HandHeartIcon;
}

function CtaCardIcon({ card }: { card: CmsPublicPage }) {
  const Icon = resolveCtaCardIcon(card.slug);

  if (card.imageUrl) {
    return (
      <img
        src={card.imageUrl}
        alt=""
        className="size-7 object-contain"
        loading="lazy"
      />
    );
  }

  return <Icon className="size-7 text-primary-foreground" aria-hidden="true" />;
}

export function HomeCtaSection({ ctaHeading, ctaCards, contactEntry }: HomeCtaSectionProps) {
  if (ctaCards.length === 0 && !ctaHeading && !contactEntry) return null;

  const eyebrow = ctaHeading?.heading ?? ctaCards[0]?.heading ?? undefined;
  const title = ctaHeading?.title ?? undefined;
  const imageSrc = resolveCtaSectionImage(ctaHeading?.imageUrl);
  const imageAlt = ctaHeading?.title ?? 'Community support';
  const showGetInvolved = ctaCards.length > 0 || Boolean(ctaHeading);

  return (
    <>
      {showGetInvolved ? (
        <SectionShell id="get-involved" className="bg-background">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div
                className="absolute -right-4 top-8 -z-10 hidden h-[85%] w-[70%] rotate-6 rounded-3xl bg-primary md:block"
                aria-hidden="true"
              />
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className="aspect-[4/5] w-full object-cover object-center"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="space-y-8">
              {(eyebrow || title) && (
                <header className="space-y-4">
                  {eyebrow ? (
                    <div className="flex items-center gap-4">
                      <span className="h-px w-10 bg-border" aria-hidden="true" />
                      <p className="text-sm font-medium tracking-wide text-muted-foreground">{eyebrow}</p>
                    </div>
                  ) : null}
                  {title ? (
                    <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-[2.5rem] lg:leading-tight">
                      {title}
                    </h2>
                  ) : null}
                  {ctaHeading?.body?.trim() ? (
                    <p className="text-base leading-relaxed text-muted-foreground">{ctaHeading.body.trim()}</p>
                  ) : null}
                </header>
              )}

              {ctaCards.length > 0 ? (
              <ul className="space-y-6">
                {ctaCards.map((card) => (
                  <li key={card.id}>
                    <article className="flex gap-5 rounded-xl border bg-card p-5 shadow-card transition-shadow duration-300 motion-safe:hover:shadow-elevated">
                      <div
                        className={cn(
                          'flex size-14 shrink-0 items-center justify-center rounded-full bg-primary',
                        )}
                        aria-hidden="true"
                      >
                        <CtaCardIcon card={card} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-bold text-foreground">{card.title}</h3>
                        {card.subheading ? (
                          <p className="mt-1 text-sm font-medium text-secondary">{card.subheading}</p>
                        ) : null}
                        <CmsBodyContent body={card.body} className="mt-2 text-sm leading-relaxed text-muted-foreground" />
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
              ) : null}
            </div>
          </div>
        </SectionShell>
      ) : null}

      {contactEntry ? (
        <SectionShell id="contact-cta" variant="primary" animate={false} containerClassName="pb-0">
          <div className="relative overflow-hidden rounded-2xl bg-primary-dark p-8 text-center md:p-14">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(244,180,0,0.15),transparent_55%)]"
              aria-hidden="true"
            />
            <div className="relative mx-auto max-w-3xl space-y-5">
              {contactEntry.heading ? (
                <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
                  {contactEntry.heading}
                </p>
              ) : null}
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl">
                {contactEntry.title}
              </h2>
              {contactEntry.subheading ? (
                <p className="text-lg text-primary-foreground/90">{contactEntry.subheading}</p>
              ) : null}
              <CmsBodyContent body={contactEntry.body} className="text-primary-foreground/85" />
              <AppButton asChild size="lg" variant="accent" className="mt-2">
                <Link to="/contact">
                  {contactEntry.title}
                  <ArrowRightIcon className="size-4" />
                </Link>
              </AppButton>
            </div>
          </div>
        </SectionShell>
      ) : null}
    </>
  );
}
