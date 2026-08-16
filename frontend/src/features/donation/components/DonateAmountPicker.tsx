import { useTranslation } from 'react-i18next';
import { DONATION_PRESET_AMOUNTS } from '@/features/donation/types/donation.types';
import { formatAud } from '@/lib/currency';
import { cn } from '@/lib/utils';

type DonateAmountPickerProps = {
  value: number;
  onChange: (amount: number) => void;
  error?: string;
};

export function DonateAmountPicker({ value, onChange, error }: DonateAmountPickerProps) {
  const { t } = useTranslation();
  const isPresetSelected = DONATION_PRESET_AMOUNTS.some((preset) => preset === value);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-foreground">
          {t('donate.amountLabel')} <span className="text-destructive">*</span>
        </p>
        <span className="shrink-0 rounded-md border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground">
          {t('donate.currency')}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {DONATION_PRESET_AMOUNTS.map((preset) => {
          const isSelected = value === preset;

          return (
            <button
              key={preset}
              type="button"
              onClick={() => onChange(preset)}
              className={cn(
                'rounded-lg border px-2 py-3 text-sm font-semibold transition-colors',
                isSelected
                  ? 'border-accent bg-accent text-accent-foreground'
                  : 'border-border bg-background text-foreground hover:border-accent/50',
              )}
            >
              {formatAud(preset)}
            </button>
          );
        })}
      </div>

      <input
        id="donation-custom-amount"
        type="number"
        min={2}
        step="1"
        value={isPresetSelected ? '' : value || ''}
        placeholder={t('donate.customAmountPlaceholder')}
        onChange={(event) => {
          const next = Number(event.target.value);
          onChange(Number.isFinite(next) ? next : 0);
        }}
        className={cn(
          'flex h-11 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-xs transition-colors',
          'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          error && 'border-destructive',
        )}
      />

      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
