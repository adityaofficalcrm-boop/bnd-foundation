import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteVolunteerApplication,
  fetchNewVolunteerApplicationCount,
  fetchVolunteerApplication,
  fetchVolunteerApplications,
  submitVolunteerApplication,
} from '@/features/volunteer/api/volunteer.api';
import type { SubmitVolunteerPayload } from '@/features/volunteer/schemas/volunteer.schema';
import type { VolunteerApplicationListParams } from '@/features/volunteer/types/volunteer.types';

export const volunteerQueryKeys = {
  all: ['volunteers'] as const,
  list: (params: VolunteerApplicationListParams) =>
    [...volunteerQueryKeys.all, 'list', params] as const,
  detail: (id: string) => [...volunteerQueryKeys.all, 'detail', id] as const,
  newCount: () => [...volunteerQueryKeys.all, 'new-count'] as const,
};

export function useSubmitVolunteerApplication() {
  return useMutation({
    mutationFn: (payload: SubmitVolunteerPayload) => submitVolunteerApplication(payload),
  });
}

export function useVolunteerApplications(params: VolunteerApplicationListParams) {
  return useQuery({
    queryKey: volunteerQueryKeys.list(params),
    queryFn: () => fetchVolunteerApplications(params),
  });
}

export function useVolunteerApplication(id: string | undefined) {
  return useQuery({
    queryKey: volunteerQueryKeys.detail(id ?? ''),
    queryFn: () => fetchVolunteerApplication(id!),
    enabled: Boolean(id),
  });
}

export function useDeleteVolunteerApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteVolunteerApplication(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: volunteerQueryKeys.all });
    },
  });
}

export function useNewVolunteerApplicationCount() {
  return useQuery({
    queryKey: volunteerQueryKeys.newCount(),
    queryFn: fetchNewVolunteerApplicationCount,
  });
}
