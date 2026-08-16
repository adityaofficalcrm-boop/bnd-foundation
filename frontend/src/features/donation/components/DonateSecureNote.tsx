import { LockIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function DonateSecureNote() {
  const { t } = useTranslation();

  return (
    <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
      <LockIcon className="size-3.5 text-accent" aria-hidden="true" />
      {t('donate.secure')}
    </p>
  );
}
