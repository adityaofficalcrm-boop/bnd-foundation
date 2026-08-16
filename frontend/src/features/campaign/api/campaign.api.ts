import axios from 'axios';
import { env } from '@/config/env';
import type { CampaignFormValues } from '@/features/campaign/schemas/campaign.schema';
import type {
  ApiSuccessResponse,
  Campaign,
  CampaignListParams,
  PaginationMeta,
} from '@/features/campaign/types/campaign.types';
import { apiClient } from '@/lib/api';

const publicApiClient = axios.create({
  baseURL: env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function fetchCampaigns(params: CampaignListParams = {}) {
  const { data } = await apiClient.get<ApiSuccessResponse<Campaign[]>>('/campaigns', { params });
  return {
    campaigns: data.data,
    pagination: data.meta?.pagination as PaginationMeta,
    message: data.message,
  };
}

export async function fetchCampaign(id: string) {
  const { data } = await apiClient.get<ApiSuccessResponse<Campaign>>(`/campaigns/${id}`);
  return data.data;
}

export async function createCampaign(payload: CampaignFormValues) {
  const { data } = await apiClient.post<ApiSuccessResponse<Campaign>>('/campaigns', payload);
  return data.data;
}

export async function updateCampaign(id: string, payload: Partial<CampaignFormValues>) {
  const { data } = await apiClient.put<ApiSuccessResponse<Campaign>>(`/campaigns/${id}`, payload);
  return data.data;
}

export async function deleteCampaign(id: string) {
  await apiClient.delete(`/campaigns/${id}`);
}

export async function fetchPublicCampaigns() {
  const { data } = await publicApiClient.get<ApiSuccessResponse<Campaign[]>>('/campaigns/public');
  return data.data;
}

export async function fetchPublicCampaignBySlug(slug: string) {
  const { data } = await publicApiClient.get<ApiSuccessResponse<Campaign>>(
    `/campaigns/public/${slug}`,
  );
  return data.data;
}
