import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteContactSubmission,
  fetchContactSubmission,
  fetchContactSubmissions,
  fetchNewContactSubmissionCount,
  submitContactForm,
} from '@/features/contact/api/contact.api';
import type { ContactSubmissionListParams } from '@/features/contact/types/contact.types';
import type { SubmitContactPayload } from '@/features/contact/schemas/contact.schema';

export const contactQueryKeys = {
  all: ['contact-submissions'] as const,
  list: (params: ContactSubmissionListParams) => [...contactQueryKeys.all, 'list', params] as const,
  detail: (id: string) => [...contactQueryKeys.all, 'detail', id] as const,
  newCount: () => [...contactQueryKeys.all, 'new-count'] as const,
};

export function useSubmitContactForm() {
  return useMutation({
    mutationFn: (payload: SubmitContactPayload) => submitContactForm(payload),
  });
}

export function useContactSubmissions(params: ContactSubmissionListParams) {
  return useQuery({
    queryKey: contactQueryKeys.list(params),
    queryFn: () => fetchContactSubmissions(params),
  });
}

export function useContactSubmission(id: string | undefined) {
  return useQuery({
    queryKey: contactQueryKeys.detail(id ?? ''),
    queryFn: () => fetchContactSubmission(id!),
    enabled: Boolean(id),
  });
}

export function useDeleteContactSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteContactSubmission(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: contactQueryKeys.all });
    },
  });
}

export function useNewContactSubmissionCount() {
  return useQuery({
    queryKey: contactQueryKeys.newCount(),
    queryFn: fetchNewContactSubmissionCount,
  });
}
