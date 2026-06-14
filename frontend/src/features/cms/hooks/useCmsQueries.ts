import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createCmsPage,
  deleteCmsPage,
  fetchCmsPage,
  fetchCmsPages,
  updateCmsPage,
} from '@/features/cms/api/cms.api';
import type { CmsListParams, CreateCmsPayload, UpdateCmsPayload } from '@/features/cms/types/cms.types';

export const cmsQueryKeys = {
  all: ['cms'] as const,
  list: (params: CmsListParams) => [...cmsQueryKeys.all, 'list', params] as const,
  detail: (id: string) => [...cmsQueryKeys.all, 'detail', id] as const,
};

export function useCmsList(params: CmsListParams) {
  return useQuery({
    queryKey: cmsQueryKeys.list(params),
    queryFn: () => fetchCmsPages(params),
  });
}

export function useCmsPage(id: string | undefined) {
  return useQuery({
    queryKey: cmsQueryKeys.detail(id ?? ''),
    queryFn: () => fetchCmsPage(id!),
    enabled: Boolean(id),
  });
}

export function useCreateCmsPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCmsPayload) => createCmsPage(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cmsQueryKeys.all });
    },
  });
}

export function useUpdateCmsPage(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCmsPayload) => updateCmsPage(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cmsQueryKeys.all });
    },
  });
}

export function useDeleteCmsPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCmsPage(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cmsQueryKeys.all });
    },
  });
}
