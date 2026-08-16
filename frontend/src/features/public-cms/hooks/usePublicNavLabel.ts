import { useTranslation } from 'react-i18next';
import type { AppLocale } from '@/i18n';
import { getNavLabelFromCms } from '@/features/public-cms/utils/cms-entry-filters';

/** Maps CMS nav-* slugs to i18n keys under `nav.*`. */
export const NAV_I18N_KEYS: Record<string, string> = {
  'nav-home': 'nav.home',
  'nav-about': 'nav.about',
  'nav-about-history': 'nav.aboutHistory',
  'nav-about-donors': 'nav.aboutDonors',
  'nav-about-impact': 'nav.aboutImpact',
  'nav-team': 'nav.team',
  'nav-projects': 'nav.projects',
  'nav-campaigns': 'nav.campaigns',
  'nav-gallery': 'nav.gallery',
  'nav-volunteer': 'nav.volunteer',
  'nav-contact': 'nav.contact',
  'nav-donate': 'nav.donate',
};

/**
 * English: prefer CMS nav title when present.
 * Nepali (and other locales): use translated labels so the chrome is bilingual
 * even when CMS content is still English-only.
 */
export function usePublicNavLabel(
  pages: Array<{ slug: string; title: string }>,
  navSlug: string,
  fallbackLabel: string,
): string {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language?.split('-')[0] ?? 'en') as AppLocale;
  const i18nKey = NAV_I18N_KEYS[navSlug];
  const translated = i18nKey ? t(i18nKey, { defaultValue: fallbackLabel }) : fallbackLabel;

  if (locale !== 'en') {
    return translated;
  }

  return getNavLabelFromCms(pages, navSlug, translated);
}
