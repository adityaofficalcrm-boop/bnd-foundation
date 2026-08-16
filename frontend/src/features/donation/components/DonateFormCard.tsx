import { ArrowLeftIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { AppButton } from '@/components/app';
import { cn } from '@/lib/utils';

type DonateFormCardProps = {
  children: ReactNode;
  step: 1 | 2 | 3;
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  className?: string;
};

const PROGRESS_WIDTH: Record<1 | 2 | 3, string> = {
  1: '33%',
  2: '66%',
  3: '100%',
};

export function DonateFormCard({
  children,
  step,
  title,
  subtitle,
  onBack,
  className,
}: DonateFormCardProps) {
  const { t } = useTranslation();

  return (
    <div className={cn('overflow-hidden rounded-xl border bg-card shadow-card', className)}>
      <div className="h-1 bg-muted">
        <div
          className="h-full bg-accent transition-all duration-300"
          style={{ width: PROGRESS_WIDTH[step] }}
          role="progressbar"
          aria-valuenow={step}
          aria-valuemin={1}
          aria-valuemax={3}
        />
      </div>

      <div className="p-6 md:p-8">
        {step > 1 && onBack ? (
          <AppButton
            type="button"
            variant="ghost"
            size="icon"
            className="mb-4 -ml-2 text-muted-foreground"
            onClick={onBack}
            aria-label={t('cta.goBack')}
          >
            <ArrowLeftIcon className="size-5" />
          </AppButton>
        ) : null}

        {title ? (
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">{title}</h2>
            {subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
          </div>
        ) : null}

        {children}
      </div>
    </div>
  );
}
