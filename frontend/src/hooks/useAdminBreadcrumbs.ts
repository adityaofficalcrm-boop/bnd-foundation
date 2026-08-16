import { useLocation } from 'react-router-dom';
import type { BreadcrumbItem } from '@/components/app/PageHeader';

export function useAdminBreadcrumbs(): BreadcrumbItem[] {
  const { pathname } = useLocation();

  if (pathname === '/admin') {
    return [{ label: 'Admin', href: '/admin' }, { label: 'Dashboard' }];
  }

  if (pathname.startsWith('/admin/cms')) {
    if (pathname === '/admin/cms') {
      return [{ label: 'Admin', href: '/admin' }, { label: 'CMS' }];
    }

    if (pathname === '/admin/cms/new') {
      return [{ label: 'Admin', href: '/admin' }, { label: 'CMS', href: '/admin/cms' }, { label: 'Create' }];
    }

    if (pathname.endsWith('/edit')) {
      return [{ label: 'Admin', href: '/admin' }, { label: 'CMS', href: '/admin/cms' }, { label: 'Edit' }];
    }
  }

  if (pathname.startsWith('/admin/contact')) {
    return [{ label: 'Admin', href: '/admin' }, { label: 'Contact' }];
  }

  if (pathname.startsWith('/admin/team')) {
    return [{ label: 'Admin', href: '/admin' }, { label: 'Team' }];
  }

  return [{ label: 'Admin', href: '/admin' }, { label: 'Dashboard', href: '/admin' }];
}
