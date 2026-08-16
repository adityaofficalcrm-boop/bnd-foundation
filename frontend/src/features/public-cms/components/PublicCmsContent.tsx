import { MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react';
import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';
import { CmsBodyContent } from '@/features/public-cms/components/CmsBodyContent';
import { resolveCmsHeroDisplay, resolveCmsHeroImageAlt } from '@/features/public-cms/utils/resolve-cms-display';
import { cn } from '@/lib/utils';

type PublicCmsHeroProps = {
  entry: CmsPublicPage;
  className?: string;
};

export function PublicCmsHero({ entry, className }: PublicCmsHeroProps) {
  const { eyebrow, title, subheading } = resolveCmsHeroDisplay(entry);
  const imageAlt = resolveCmsHeroImageAlt(entry);

  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-primary via-primary to-primary-dark text-primary-foreground shadow-elevated',
        className,
      )}
    >
      <div className="pointer-events-none absolute -top-16 -right-16 size-64 rounded-full bg-white/5" aria-hidden="true" />
      <div className="relative grid gap-8 p-6 md:p-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div className="space-y-4">
          {eyebrow ? (
            <p className="text-sm font-medium tracking-wide text-primary-foreground/80 uppercase">
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">{title}</h1>
          ) : null}
          {subheading ? (
            <p className="max-w-2xl text-base leading-relaxed text-primary-foreground/90 md:text-lg">
              {subheading}
            </p>
          ) : null}
          <CmsBodyContent body={entry.body} className="text-primary-foreground/85" />
        </div>
        {entry.imageUrl ? (
          <div className="overflow-hidden rounded-xl border border-white/15 bg-white/5">
            <img
              src={entry.imageUrl}
              alt={imageAlt}
              className="aspect-[4/3] w-full object-cover"
              loading="eager"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}

type PublicCmsContentBlockProps = {
  entry: CmsPublicPage;
  className?: string;
};

export function PublicCmsContentBlock({ entry, className }: PublicCmsContentBlockProps) {
  return (
    <article
      className={cn(
        'overflow-hidden rounded-2xl border bg-card shadow-card transition-all duration-300 motion-safe:hover:shadow-elevated',
        className,
      )}
    >
      {entry.imageUrl ? (
        <div className="overflow-hidden">
          <img
            src={entry.imageUrl}
            alt={entry.title}
            className="aspect-[16/9] w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
      ) : null}
      <div className="space-y-3 p-6 md:p-8">
        {entry.heading ? (
          <p className="text-sm font-semibold tracking-[0.18em] text-secondary uppercase">{entry.heading}</p>
        ) : null}
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{entry.title}</h2>
        {entry.subheading ? (
          <p className="text-lg text-muted-foreground">{entry.subheading}</p>
        ) : null}
        <CmsBodyContent body={entry.body} />
      </div>
    </article>
  );
}

type PublicCmsContactBlockProps = {
  entry: CmsPublicPage;
  className?: string;
};

export function PublicCmsContactBlock({ entry, className }: PublicCmsContactBlockProps) {
  const { meta } = entry;

  return (
    <article className={cn('space-y-6', className)}>
      <div className="space-y-3">
        {entry.heading ? (
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">{entry.heading}</p>
        ) : null}
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{entry.title}</h2>
        {entry.subheading ? (
          <p className="text-lg text-muted-foreground">{entry.subheading}</p>
        ) : null}
        <CmsBodyContent body={entry.body} />
      </div>

      {meta?.email || meta?.phone || meta?.address ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {meta.email ? (
            <div className="rounded-xl border bg-card p-5 shadow-card">
              <MailIcon className="size-5 text-primary" aria-hidden="true" />
              <h3 className="mt-3 text-sm font-semibold text-foreground">Email</h3>
              <a href={`mailto:${meta.email}`} className="mt-1 block text-sm text-muted-foreground hover:text-primary">
                {meta.email}
              </a>
            </div>
          ) : null}
          {meta.phone ? (
            <div className="rounded-xl border bg-card p-5 shadow-card">
              <PhoneIcon className="size-5 text-primary" aria-hidden="true" />
              <h3 className="mt-3 text-sm font-semibold text-foreground">Phone</h3>
              <a href={`tel:${meta.phone}`} className="mt-1 block text-sm text-muted-foreground hover:text-primary">
                {meta.phone}
              </a>
            </div>
          ) : null}
          {meta.address ? (
            <div className="rounded-xl border bg-card p-5 shadow-card sm:col-span-2 lg:col-span-1">
              <MapPinIcon className="size-5 text-primary" aria-hidden="true" />
              <h3 className="mt-3 text-sm font-semibold text-foreground">Address</h3>
              <p className="mt-1 text-sm whitespace-pre-line text-muted-foreground">{meta.address}</p>
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
