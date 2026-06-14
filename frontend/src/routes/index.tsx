import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/public/PublicLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { GuestRoute, ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { CmsCreatePage } from '@/pages/admin/cms/CmsCreatePage';
import { CmsEditPage } from '@/pages/admin/cms/CmsEditPage';
import { CmsListPage } from '@/pages/admin/cms/CmsListPage';
import { DashboardPage } from '@/pages/admin/DashboardPage';
import { LoginPage } from '@/pages/admin/LoginPage';
import { PublicAboutPage } from '@/pages/public/PublicAboutPage';
import { PublicContactPage } from '@/pages/public/PublicContactPage';
import { PublicHomePage } from '@/pages/public/PublicHomePage';
import { PublicMissionPage } from '@/pages/public/PublicMissionPage';

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: '/',
        element: <PublicHomePage />,
      },
      {
        path: '/about',
        element: <PublicAboutPage />,
      },
      {
        path: '/mission',
        element: <PublicMissionPage />,
      },
      {
        path: '/contact',
        element: <PublicContactPage />,
      },
    ],
  },
  {
    element: <GuestRoute />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: 'cms',
            element: <CmsListPage />,
          },
          {
            path: 'cms/new',
            element: <CmsCreatePage />,
          },
          {
            path: 'cms/:id/edit',
            element: <CmsEditPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
