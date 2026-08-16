import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createCampaign,
  deleteCampaign,
  fetchCampaign,
  fetchCampaigns,
  fetchPublicCampaignBySlug,
  fetchPublicCampaigns,
  updateCampaign,
} from '@/features/campaign/api/campaign.api';
import type { CampaignFormValues } from '@/features/campaign/schemas/campaign.schema';
import type { CampaignListParams } from '@/features/campaign/types/campaign.types';

export const campaignQueryKeys = {
  all: ['campaigns'] as const,
  list: (params: CampaignListParams) => [...campaignQueryKeys.all, 'list', params] as const,
  detail: (id: string) => [...campaignQueryKeys.all, 'detail', id] as const,
  public: () => [...campaignQueryKeys.all, 'public'] as const,
  publicSlug: (slug: string) => [...campaignQueryKeys.all, 'public', slug] as const,
};

export function useCampaigns(params: CampaignListParams) {
  return useQuery({
    queryKey: campaignQueryKeys.list(params),
    queryFn: () => fetchCampaigns(params),
  });
}

export function useCampaign(id: string | undefined) {
  return useQuery({
    queryKey: campaignQueryKeys.detail(id ?? ''),
    queryFn: () => fetchCampaign(id!),
    enabled: Boolean(id),
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CampaignFormValues) => createCampaign(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: campaignQueryKeys.all });
    },
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CampaignFormValues> }) =>
      updateCampaign(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: campaignQueryKeys.all });
    },
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCampaign(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: campaignQueryKeys.all });
    },
  });
}

export function usePublicCampaigns() {
  return useQuery({
    queryKey: campaignQueryKeys.public(),
    queryFn: fetchPublicCampaigns,
  });
}

export function usePublicCampaign(slug: string | undefined) {
  return useQuery({
    queryKey: campaignQueryKeys.publicSlug(slug ?? ''),
    queryFn: () => fetchPublicCampaignBySlug(slug!),
    enabled: Boolean(slug),
  });
}
