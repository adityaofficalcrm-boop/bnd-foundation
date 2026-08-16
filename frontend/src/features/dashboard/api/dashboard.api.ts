import { apiClient } from '@/lib/api';
import type { ApiSuccessResponse, DashboardStats } from '@/features/dashboard/types/dashboard.types';

export async function fetchDashboardStats() {
  const { data } = await apiClient.get<ApiSuccessResponse<DashboardStats>>('/dashboard/stats');
  return data.data;
}
