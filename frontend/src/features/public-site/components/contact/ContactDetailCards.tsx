import type { ReactNode } from 'react';
import { MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { resolveGoogleMapsUrl } from '@/lib/google-maps-url';

type ContactDetailCardsProps = {
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  mapsUrl?: string | null;
};

function ContactDetailCard({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof PhoneIcon;
  label: string;
  children: ReactNode;
}) {
  return (
    <article className="flex flex-col items-center rounded-2xl border bg-card p-6 text-center shadow-card">
      <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-6" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-sm font-semibold text-foreground">{label}</h2>
      <div className="mt-2 text-sm text-muted-foreground md:text-base">{children}</div>
    </article>
  );
}

export function ContactDetailCards({ phone, email, address, mapsUrl }: ContactDetailCardsProps) {
  const { t } = useTranslation();
  const hasAny = Boolean(phone?.trim() || email?.trim() || address?.trim());

  if (!hasAny) {
    return null;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {phone?.trim() ? (
        <ContactDetailCard icon={PhoneIcon} label={t('contact.telephone')}>
          <a href={`tel:${phone.trim()}`} className="break-all transition-colors hover:text-primary">
            {phone.trim()}
          </a>
        </ContactDetailCard>
      ) : null}

      {email?.trim() ? (
        <ContactDetailCard icon={MailIcon} label={t('contact.mail')}>
          <a href={`mailto:${email.trim()}`} className="break-all transition-colors hover:text-primary">
            {email.trim()}
          </a>
        </ContactDetailCard>
      ) : null}

      {address?.trim() ? (
        <ContactDetailCard icon={MapPinIcon} label={t('contact.ourAddress')}>
          <a
            href={resolveGoogleMapsUrl(address.trim(), mapsUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-pre-line break-words transition-colors hover:text-primary"
          >
            {address.trim()}
          </a>
        </ContactDetailCard>
      ) : null}
    </div>
  );
}
