import { apiClient } from '@/lib/api';
import type {
  ApiSuccessResponse,
  CmsListParams,
  CmsPage,
  CreateCmsPayload,
  PaginationMeta,
  UpdateCmsPayload,
} from '@/features/cms/types/cms.types';

export async function fetchCmsPages(params: CmsListParams = {}) {
  const { data } = await apiClient.get<ApiSuccessResponse<CmsPage[]>>('/cms', { params });
  return {
    pages: data.data,
    pagination: data.meta?.pagination as PaginationMeta,
    message: data.message,
  };
}

export async function fetchCmsPage(id: string) {
  const { data } = await apiClient.get<ApiSuccessResponse<CmsPage>>(`/cms/${id}`);
  return data.data;
}

export async function createCmsPage(payload: CreateCmsPayload) {
  const { data } = await apiClient.post<ApiSuccessResponse<CmsPage>>('/cms', payload);
  return data.data;
}

export async function updateCmsPage(id: string, payload: UpdateCmsPayload) {
  const { data } = await apiClient.put<ApiSuccessResponse<CmsPage>>(`/cms/${id}`, payload);
  return data.data;
}

export async function deleteCmsPage(id: string) {
  await apiClient.delete(`/cms/${id}`);
}
