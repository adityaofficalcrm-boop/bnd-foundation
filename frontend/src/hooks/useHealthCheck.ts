import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

type HealthResponse = {
  status: string;
  service: string;
  timestamp: string;
};

export function useHealthCheck() {
  return useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const { data } = await apiClient.get<HealthResponse>('/health');
      return data;
    },
  });
}
