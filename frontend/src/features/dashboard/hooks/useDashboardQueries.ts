import { useQuery } from '@tanstack/react-query';
import { fetchDashboardStats } from '@/features/dashboard/api/dashboard.api';

export const dashboardQueryKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardQueryKeys.all, 'stats'] as const,
};

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardQueryKeys.stats(),
    queryFn: fetchDashboardStats,
    refetchInterval: 60_000,
  });
}
