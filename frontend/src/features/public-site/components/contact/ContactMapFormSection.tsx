import { ContactForm } from '@/features/public-site/components/contact/ContactForm';
import { resolveGoogleMapsEmbedUrl } from '@/lib/google-maps-url';

type ContactMapFormSectionProps = {
  address?: string | null;
  mapsUrl?: string | null;
};

export function ContactMapFormSection({ address, mapsUrl }: ContactMapFormSectionProps) {
  const embedUrl = resolveGoogleMapsEmbedUrl(address ?? '', mapsUrl);

  return (
    <section className="space-y-6 lg:relative lg:min-h-[36rem]">
      <div className="min-h-[18rem] overflow-hidden rounded-2xl border bg-muted sm:min-h-[24rem] lg:absolute lg:inset-0 lg:min-h-0">
        {embedUrl ? (
          <iframe
            title="Foundation location on Google Maps"
            src={embedUrl}
            className="h-full min-h-[18rem] w-full border-0 sm:min-h-[24rem] lg:absolute lg:inset-0 lg:min-h-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <div className="flex h-full min-h-[18rem] items-center justify-center p-6 text-center text-sm text-muted-foreground sm:min-h-[24rem]">
            Add an address in the Contact Information CMS entry to display the map.
          </div>
        )}
      </div>

      <div className="rounded-2xl border bg-card p-5 shadow-elevated sm:p-6 lg:absolute lg:top-1/2 lg:right-6 lg:z-10 lg:w-[min(100%,24rem)] lg:-translate-y-1/2 xl:right-10 xl:w-[28rem]">
        <ContactForm />
      </div>
    </section>
  );
}
