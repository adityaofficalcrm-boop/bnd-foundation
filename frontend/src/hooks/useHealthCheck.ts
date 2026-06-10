import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};

type HealthData = {
  status: 'ok' | 'degraded';
  service: string;
  version: string;
  environment: string;
  timestamp: string;
  database: {
    connected: boolean;
    state: string;
  };
};

export function useHealthCheck() {
  return useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiSuccessResponse<HealthData>>('/health');
      return data.data;
    },
  });
}
