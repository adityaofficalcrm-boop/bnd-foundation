import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  confirmDonationCheckout,
  deleteDonation,
  fetchDonation,
  fetchDonations,
  fetchPendingDonationCount,
  fetchRecentDonations,
  fetchTopDonors,
  submitDonationForm,
} from '@/features/donation/api/donation.api';
import type { SubmitDonationPayload } from '@/features/donation/schemas/donation.schema';
import type { DonationListParams } from '@/features/donation/types/donation.types';

export const donationQueryKeys = {
  all: ['donations'] as const,
  list: (params: DonationListParams) => [...donationQueryKeys.all, 'list', params] as const,
  detail: (id: string) => [...donationQueryKeys.all, 'detail', id] as const,
  pendingCount: () => [...donationQueryKeys.all, 'pending-count'] as const,
  recent: () => [...donationQueryKeys.all, 'recent'] as const,
  topDonors: () => [...donationQueryKeys.all, 'top-donors'] as const,
  confirm: (sessionId: string) => [...donationQueryKeys.all, 'confirm', sessionId] as const,
};

export function useSubmitDonationForm() {
  return useMutation({
    mutationFn: (payload: SubmitDonationPayload) => submitDonationForm(payload),
  });
}

export function useConfirmDonation(sessionId: string | undefined) {
  return useQuery({
    queryKey: donationQueryKeys.confirm(sessionId ?? ''),
    queryFn: () => confirmDonationCheckout(sessionId!),
    enabled: Boolean(sessionId),
    retry: 1,
  });
}

export function useDonations(params: DonationListParams) {
  return useQuery({
    queryKey: donationQueryKeys.list(params),
    queryFn: () => fetchDonations(params),
  });
}

export function useDonation(id: string | undefined) {
  return useQuery({
    queryKey: donationQueryKeys.detail(id ?? ''),
    queryFn: () => fetchDonation(id!),
    enabled: Boolean(id),
  });
}

export function useDeleteDonation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDonation(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: donationQueryKeys.all });
    },
  });
}

export function usePendingDonationCount() {
  return useQuery({
    queryKey: donationQueryKeys.pendingCount(),
    queryFn: fetchPendingDonationCount,
  });
}

export function useRecentDonations() {
  return useQuery({
    queryKey: donationQueryKeys.recent(),
    queryFn: fetchRecentDonations,
  });
}

export function useTopDonors() {
  return useQuery({
    queryKey: donationQueryKeys.topDonors(),
    queryFn: fetchTopDonors,
  });
}
