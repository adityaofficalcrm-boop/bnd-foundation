import axios from 'axios';
import { env } from '@/config/env';
import type { SubmitDonationPayload } from '@/features/donation/schemas/donation.schema';
import type {
  ApiSuccessResponse,
  Donation,
  DonationListParams,
  PaginationMeta,
  PublicDonationSummary,
  TopDonorSummary,
} from '@/features/donation/types/donation.types';
import { apiClient } from '@/lib/api';

const publicApiClient = axios.create({
  baseURL: env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export type DonationCheckoutResult = {
  donation: Donation;
  checkoutUrl: string;
};

export async function submitDonationForm(payload: SubmitDonationPayload) {
  const { data } = await publicApiClient.post<ApiSuccessResponse<DonationCheckoutResult>>(
    '/donations',
    payload,
  );
  return data.data;
}

export async function confirmDonationCheckout(sessionId: string) {
  const { data } = await publicApiClient.get<ApiSuccessResponse<Donation>>('/donations/confirm', {
    params: { session_id: sessionId },
  });
  return data.data;
}

export async function fetchDonations(params: DonationListParams = {}) {
  const { data } = await apiClient.get<ApiSuccessResponse<Donation[]>>('/donations', { params });
  return {
    donations: data.data,
    pagination: data.meta?.pagination as PaginationMeta,
    message: data.message,
  };
}

export async function fetchDonation(id: string) {
  const { data } = await apiClient.get<ApiSuccessResponse<Donation>>(`/donations/${id}`);
  return data.data;
}

export async function deleteDonation(id: string) {
  await apiClient.delete(`/donations/${id}`);
}

export async function fetchPendingDonationCount() {
  const { data } = await apiClient.get<ApiSuccessResponse<{ count: number }>>(
    '/donations/stats/pending-count',
  );
  return data.data.count;
}

export async function fetchRecentDonations() {
  const { data } = await publicApiClient.get<ApiSuccessResponse<PublicDonationSummary[]>>(
    '/donations/public/recent',
  );
  return data.data;
}

export async function fetchTopDonors() {
  const { data } = await publicApiClient.get<ApiSuccessResponse<TopDonorSummary[]>>(
    '/donations/public/top-donors',
  );
  return data.data;
}
