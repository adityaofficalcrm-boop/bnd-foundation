import type { CmsMeta } from '@/features/cms/types/cms.types';
import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';
import type { AppLocale } from '@/i18n';
import { cmsNeOverlays } from '@/i18n/cms-overlays/ne';
import { cmsRoleNe } from '@/i18n/cms-overlays/roles-ne';

export type CmsLocaleFields = {
  title?: string;
  heading?: string;
  subheading?: string;
  body?: string;
  meta?: Partial<Pick<CmsMeta, 'ctaLabel' | 'role' | 'group' | 'location' | 'grantProvider'>>;
};

export type CmsI18nMap = {
  ne?: CmsLocaleFields;
};

function pickText(preferred?: string | null, fallback?: string | null): string | undefined {
  const value = preferred?.trim() || fallback?.trim();
  return value || undefined;
}

function localizeRole(role: string | undefined, locale: AppLocale): string | undefined {
  if (!role) return undefined;
  if (locale !== 'ne') return role;
  return cmsRoleNe[role] ?? role;
}

/** Merge English CMS entry with Nepali CMS fields and/or built-in overlays. */
export function localizeCmsEntry<T extends CmsPublicPage & { i18n?: CmsI18nMap }>(
  entry: T,
  locale: AppLocale | string,
): T {
  const lang = (locale.split('-')[0] || 'en') as AppLocale;
  if (lang !== 'ne') {
    return entry;
  }

  const fromCms = entry.i18n?.ne;
  const fromOverlay = cmsNeOverlays[entry.slug];
  const ne = {
    title: fromCms?.title ?? fromOverlay?.title,
    heading: fromCms?.heading ?? fromOverlay?.heading,
    subheading: fromCms?.subheading ?? fromOverlay?.subheading,
    body: fromCms?.body ?? fromOverlay?.body,
    meta: {
      ...fromOverlay?.meta,
      ...fromCms?.meta,
    },
  };

  const localizedRole =
    pickText(ne.meta?.role, undefined) ?? localizeRole(entry.meta?.role, lang);

  const hasAny =
    Boolean(ne.title) ||
    Boolean(ne.heading) ||
    Boolean(ne.subheading) ||
    Boolean(ne.body) ||
    Boolean(localizedRole && localizedRole !== entry.meta?.role) ||
    Object.keys(ne.meta ?? {}).length > 0;

  if (!hasAny) {
    return entry;
  }

  return {
    ...entry,
    title: pickText(ne.title, entry.title) ?? entry.title,
    heading: pickText(ne.heading, entry.heading),
    subheading: pickText(ne.subheading, entry.subheading),
    body: pickText(ne.body, entry.body) ?? entry.body,
    meta: entry.meta || ne.meta || localizedRole
      ? {
          ...entry.meta,
          ctaLabel: pickText(ne.meta?.ctaLabel, entry.meta?.ctaLabel),
          role: localizedRole ?? entry.meta?.role,
          group: pickText(ne.meta?.group, entry.meta?.group),
          location: pickText(ne.meta?.location, entry.meta?.location),
          grantProvider: pickText(ne.meta?.grantProvider, entry.meta?.grantProvider),
        }
      : entry.meta,
  };
}

export function localizeCmsEntries<T extends CmsPublicPage & { i18n?: CmsI18nMap }>(
  entries: T[],
  locale: AppLocale | string,
): T[] {
  return entries.map((entry) => localizeCmsEntry(entry, locale));
}
