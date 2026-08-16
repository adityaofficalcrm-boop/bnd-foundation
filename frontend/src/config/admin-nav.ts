import {
  LayoutDashboard,
  ImageIcon,
  HeartHandshakeIcon,
  HandHeartIcon,
  UsersIcon,
  MegaphoneIcon,
  FileTextIcon,
  InboxIcon,
  type LucideIcon,
} from 'lucide-react';
import { USER_ROLES, type UserRole } from '@/features/auth/types/auth.types';

export interface AdminNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[];
  disabled?: boolean;
  badge?: string;
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

export const adminNavGroups: AdminNavGroup[] = [
  {
    label: 'Overview',
    items: [
      {
        title: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
        roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN],
      },
    ],
  },
  {
    label: 'Foundation',
    items: [
      {
        title: 'CMS',
        href: '/admin/cms',
        icon: FileTextIcon,
        roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN],
      },
      {
        title: 'Contact',
        href: '/admin/contact',
        icon: InboxIcon,
        roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN],
      },
      {
        title: 'Volunteers',
        href: '/admin/volunteers',
        icon: HandHeartIcon,
        roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN],
      },
      {
        title: 'Campaigns',
        href: '/admin/campaigns',
        icon: MegaphoneIcon,
        roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN],
      },
      {
        title: 'Donations',
        href: '/admin/donations',
        icon: HeartHandshakeIcon,
        roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN],
      },
    ],
  },
  {
    label: 'People & Media',
    items: [
      {
        title: 'Team',
        href: '/admin/team',
        icon: UsersIcon,
        roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN],
      },
      {
        title: 'Gallery',
        href: '/admin/gallery',
        icon: ImageIcon,
        roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN],
      },
    ],
  },
];

/** @deprecated Use adminNavGroups — kept for backward compatibility */
export const adminNavItems: AdminNavItem[] = adminNavGroups.flatMap((group) => group.items);
