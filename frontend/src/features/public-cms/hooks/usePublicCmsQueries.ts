import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchPublicCmsAll, fetchPublicCmsBySection } from '@/features/public-cms/api/public-cms.api';
import { localizeCmsEntries } from '@/features/public-cms/utils/localize-cms-entry';
import type { CmsSection } from '@/features/cms/types/cms.types';

export const publicCmsQueryKeys = {
  all: ['public-cms'] as const,
  section: (section: CmsSection) => [...publicCmsQueryKeys.all, 'section', section] as const,
};

export function usePublicCmsAll() {
  const { i18n } = useTranslation();
  const query = useQuery({
    queryKey: publicCmsQueryKeys.all,
    queryFn: fetchPublicCmsAll,
    staleTime: 60_000,
  });

  const data = useMemo(
    () => (query.data ? localizeCmsEntries(query.data, i18n.language) : undefined),
    [query.data, i18n.language],
  );

  return { ...query, data };
}

export function usePublicCmsSection(section: CmsSection) {
  const { i18n } = useTranslation();
  const query = useQuery({
    queryKey: publicCmsQueryKeys.section(section),
    queryFn: () => fetchPublicCmsBySection(section),
    staleTime: 60_000,
  });

  const data = useMemo(
    () => (query.data ? localizeCmsEntries(query.data, i18n.language) : undefined),
    [query.data, i18n.language],
  );

  return { ...query, data };
}
