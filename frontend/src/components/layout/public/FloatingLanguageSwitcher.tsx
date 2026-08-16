import { useEffect, useRef, useState } from 'react';
import { ChevronUpIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { AppLocale } from '@/i18n';
import { SUPPORTED_LOCALES } from '@/i18n';
import { cn } from '@/lib/utils';

const LOCALE_UI: Record<
  AppLocale,
  { code: string; label: string; flag: string; flagLabel: string }
> = {
  en: { code: 'EN', label: 'English', flag: '🇦🇺', flagLabel: 'Australia' },
  ne: { code: 'NE', label: 'नेपाली', flag: '🇳🇵', flagLabel: 'Nepal' },
};

/**
 * Floating language control — matches the old WordPress site (bottom-right).
 */
export function FloatingLanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const active = (SUPPORTED_LOCALES.includes(i18n.language as AppLocale)
    ? i18n.language
    : 'en') as AppLocale;
  const current = LOCALE_UI[active];

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const selectLocale = (locale: AppLocale) => {
    void i18n.changeLanguage(locale);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="fixed right-3 bottom-3 z-[60] sm:right-4 sm:bottom-4">
      {open ? (
        <div
          className="absolute right-0 bottom-full mb-2 min-w-[10rem] overflow-hidden rounded-md border border-border bg-background shadow-elevated"
          role="listbox"
          aria-label={t('language.switchTo')}
        >
          {SUPPORTED_LOCALES.map((locale) => {
            const item = LOCALE_UI[locale];
            const isActive = locale === active;

            return (
              <button
                key={locale}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => selectLocale(locale)}
                className={cn(
                  'flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm transition-colors',
                  isActive
                    ? 'bg-primary/10 font-semibold text-primary'
                    : 'text-foreground hover:bg-muted',
                )}
              >
                <span className="text-base leading-none" aria-hidden="true">
                  {item.flag}
                </span>
                <span className="flex-1">{item.label}</span>
                <span className="text-xs font-semibold tracking-wide text-muted-foreground">
                  {item.code}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t('language.switchTo')}
        className={cn(
          'inline-flex items-center gap-2 rounded-md border border-border/80 bg-background px-3 py-2 text-sm font-semibold text-foreground shadow-elevated',
          'transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        )}
      >
        <span className="text-base leading-none" aria-label={current.flagLabel}>
          {current.flag}
        </span>
        <span className="tracking-wide">{current.code}</span>
        <ChevronUpIcon
          className={cn('size-3.5 text-muted-foreground transition-transform', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
