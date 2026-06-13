import { LayoutDashboard, type LucideIcon } from 'lucide-react';
import { USER_ROLES, type UserRole } from '@/features/auth/types/auth.types';

export interface AdminNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[];
}

export const adminNavItems: AdminNavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN],
  },
];
