import { useQuery } from '@tanstack/react-query';
import { fetchPublicCmsAll, fetchPublicCmsBySection } from '@/features/public-cms/api/public-cms.api';
import type { CmsSection } from '@/features/cms/types/cms.types';

export const publicCmsQueryKeys = {
  all: ['public-cms'] as const,
  section: (section: CmsSection) => [...publicCmsQueryKeys.all, 'section', section] as const,
};

export function usePublicCmsAll() {
  return useQuery({
    queryKey: publicCmsQueryKeys.all,
    queryFn: fetchPublicCmsAll,
    staleTime: 60_000,
  });
}

export function usePublicCmsSection(section: CmsSection) {
  return useQuery({
    queryKey: publicCmsQueryKeys.section(section),
    queryFn: () => fetchPublicCmsBySection(section),
    staleTime: 60_000,
  });
}
