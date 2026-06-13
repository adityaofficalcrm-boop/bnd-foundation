import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { UserRole } from '@/features/auth/types/auth.types';

interface RoleProtectedRouteProps {
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export function RoleProtectedRoute({
  allowedRoles,
  redirectTo = '/admin',
}: RoleProtectedRouteProps) {
  const { hasRole, isInitializing } = useAuth();

  if (isInitializing) {
    return null;
  }

  if (!hasRole(...allowedRoles)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
