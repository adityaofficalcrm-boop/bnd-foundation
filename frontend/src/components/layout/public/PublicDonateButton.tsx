import { HeartIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppButton } from '@/components/app';
import { cn } from '@/lib/utils';

type PublicDonateButtonProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
};

export function PublicDonateButton({ className, size = 'md', onClick }: PublicDonateButtonProps) {
  const { t } = useTranslation();

  return (
    <AppButton
      asChild
      variant="accent"
      size={size}
      className={cn('font-semibold shadow-sm', className)}
    >
      <Link to="/donate" onClick={onClick}>
        <HeartIcon className="size-4" aria-hidden="true" />
        {t('cta.donateNow')}
      </Link>
    </AppButton>
  );
}
