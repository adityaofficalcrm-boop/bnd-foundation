import axios from 'axios';
import { env } from '@/config/env';
import type { SubmitVolunteerPayload } from '@/features/volunteer/schemas/volunteer.schema';
import type {
  ApiSuccessResponse,
  PaginationMeta,
  VolunteerApplication,
  VolunteerApplicationListParams,
} from '@/features/volunteer/types/volunteer.types';
import { apiClient } from '@/lib/api';

const publicApiClient = axios.create({
  baseURL: env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export async function submitVolunteerApplication(payload: SubmitVolunteerPayload) {
  const { data } = await publicApiClient.post<ApiSuccessResponse<VolunteerApplication>>(
    '/volunteers',
    payload,
  );
  return data.data;
}

export async function fetchVolunteerApplications(params: VolunteerApplicationListParams = {}) {
  const { data } = await apiClient.get<ApiSuccessResponse<VolunteerApplication[]>>('/volunteers', {
    params,
  });
  return {
    applications: data.data,
    pagination: data.meta?.pagination as PaginationMeta,
  };
}

export async function fetchVolunteerApplication(id: string) {
  const { data } = await apiClient.get<ApiSuccessResponse<VolunteerApplication>>(
    `/volunteers/${id}`,
  );
  return data.data;
}

export async function deleteVolunteerApplication(id: string) {
  await apiClient.delete(`/volunteers/${id}`);
}

export async function fetchNewVolunteerApplicationCount() {
  const { data } = await apiClient.get<ApiSuccessResponse<{ count: number }>>(
    '/volunteers/stats/new-count',
  );
  return data.data.count;
}
