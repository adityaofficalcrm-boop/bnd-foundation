import { ArrowRightIcon, MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppButton } from '@/components/app';
import { CmsBodyContent } from '@/features/public-cms/components/CmsBodyContent';
import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';
import { SectionShell } from '@/features/public-site/components/SectionShell';

type ContactCtaSectionProps = {
  entries: CmsPublicPage[];
};

export function ContactCtaSection({ entries }: ContactCtaSectionProps) {
  const entry = entries[0];
  if (!entry) return null;

  const meta = entry.meta;

  return (
    <SectionShell id="contact-cta" variant="primary" animate={false}>
      <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-8 md:p-12">
        <div
          className="pointer-events-none absolute -top-10 -right-10 size-48 rounded-full bg-accent/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div className="space-y-4">
            {entry.heading ? (
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary-foreground/80">
                {entry.heading}
              </p>
            ) : null}
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{entry.title}</h2>
            {entry.subheading ? (
              <p className="text-lg text-primary-foreground/90">{entry.subheading}</p>
            ) : null}
            <CmsBodyContent body={entry.body} className="text-primary-foreground/85" />
            <AppButton asChild size="lg" variant="accent">
              <Link to="/contact">
                {entries[1]?.title ?? entry.title}
                <ArrowRightIcon className="size-4" />
              </Link>
            </AppButton>
          </div>

          {(meta?.email || meta?.phone || meta?.address) && (
            <div className="grid gap-4">
              {meta.email ? (
                <div className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <MailIcon className="size-5" aria-hidden="true" />
                  <p className="mt-2 text-sm font-semibold">Email</p>
                  <a href={`mailto:${meta.email}`} className="text-sm text-primary-foreground/85 hover:underline">
                    {meta.email}
                  </a>
                </div>
              ) : null}
              {meta.phone ? (
                <div className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <PhoneIcon className="size-5" aria-hidden="true" />
                  <p className="mt-2 text-sm font-semibold">Phone</p>
                  <a href={`tel:${meta.phone}`} className="text-sm text-primary-foreground/85 hover:underline">
                    {meta.phone}
                  </a>
                </div>
              ) : null}
              {meta.address ? (
                <div className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <MapPinIcon className="size-5" aria-hidden="true" />
                  <p className="mt-2 text-sm font-semibold">Address</p>
                  <p className="text-sm whitespace-pre-line text-primary-foreground/85">{meta.address}</p>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </SectionShell>
  );
}
