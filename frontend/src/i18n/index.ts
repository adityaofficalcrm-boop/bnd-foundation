import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from '@/i18n/locales/en';
import { ne } from '@/i18n/locales/ne';

export const SUPPORTED_LOCALES = ['en', 'ne'] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_STORAGE_KEY = 'bnd-locale';

export const LOCALE_LABELS: Record<AppLocale, string> = {
  en: 'English',
  ne: 'नेपाली',
};

function resolveInitialLocale(): AppLocale {
  if (typeof window === 'undefined') return 'en';

  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored === 'en' || stored === 'ne') return stored;

  const browser = window.navigator.language.toLowerCase();
  if (browser.startsWith('ne')) return 'ne';

  return 'en';
}

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ne: { translation: ne },
  },
  lng: resolveInitialLocale(),
  fallbackLng: 'en',
  supportedLngs: [...SUPPORTED_LOCALES],
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (lng) => {
  const locale = (SUPPORTED_LOCALES as readonly string[]).includes(lng) ? (lng as AppLocale) : 'en';
  document.documentElement.lang = locale;
  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
});

document.documentElement.lang = i18n.language;

export { i18n };
export default i18n;
