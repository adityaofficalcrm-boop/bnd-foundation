import axios from 'axios';
import { env } from '@/config/env';
import type { SubmitContactPayload } from '@/features/contact/schemas/contact.schema';
import type {
  ApiSuccessResponse,
  ContactSubmission,
  ContactSubmissionListParams,
  PaginationMeta,
} from '@/features/contact/types/contact.types';
import { apiClient } from '@/lib/api';

const publicApiClient = axios.create({
  baseURL: env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function submitContactForm(payload: SubmitContactPayload) {
  const { data } = await publicApiClient.post<ApiSuccessResponse<ContactSubmission>>('/contact', payload);
  return data.data;
}

export async function fetchContactSubmissions(params: ContactSubmissionListParams = {}) {
  const { data } = await apiClient.get<ApiSuccessResponse<ContactSubmission[]>>('/contact', { params });
  return {
    submissions: data.data,
    pagination: data.meta?.pagination as PaginationMeta,
    message: data.message,
  };
}

export async function fetchContactSubmission(id: string) {
  const { data } = await apiClient.get<ApiSuccessResponse<ContactSubmission>>(`/contact/${id}`);
  return data.data;
}

export async function deleteContactSubmission(id: string) {
  await apiClient.delete(`/contact/${id}`);
}

export async function fetchNewContactSubmissionCount() {
  const { data } = await apiClient.get<ApiSuccessResponse<{ count: number }>>('/contact/stats/new-count');
  return data.data.count;
}
