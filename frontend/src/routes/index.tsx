import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/public/PublicLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { GuestRoute, ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { CmsCreatePage } from '@/pages/admin/cms/CmsCreatePage';
import { CmsEditPage } from '@/pages/admin/cms/CmsEditPage';
import { CmsListPage } from '@/pages/admin/cms/CmsListPage';
import { DashboardPage } from '@/pages/admin/DashboardPage';
import { LoginPage } from '@/pages/admin/LoginPage';
import { TeamMembersPage } from '@/pages/admin/team/TeamMembersPage';
import { PublicAboutIndexPage, PublicAboutSubPage } from '@/pages/public/PublicAboutSubPage';
import { PublicContactPage } from '@/pages/public/PublicContactPage';
import { CampaignCreatePage } from '@/pages/admin/campaign/CampaignCreatePage';
import { CampaignEditPage } from '@/pages/admin/campaign/CampaignEditPage';
import { CampaignsPage } from '@/pages/admin/campaign/CampaignsPage';
import { GalleryAlbumCreatePage } from '@/pages/admin/gallery/GalleryAlbumCreatePage';
import { GalleryAlbumEditPage } from '@/pages/admin/gallery/GalleryAlbumEditPage';
import { GalleryAlbumsPage } from '@/pages/admin/gallery/GalleryAlbumsPage';
import { PublicCampaignDetailPage } from '@/pages/public/PublicCampaignDetailPage';
import { PublicCampaignsPage } from '@/pages/public/PublicCampaignsPage';
import { ContactSubmissionsPage } from '@/pages/admin/contact/ContactSubmissionsPage';
import { DonationsPage } from '@/pages/admin/donation/DonationsPage';
import { PublicDonateCancelPage } from '@/pages/public/PublicDonateCancelPage';
import { PublicDonatePage } from '@/pages/public/PublicDonatePage';
import { PublicDonateSuccessPage } from '@/pages/public/PublicDonateSuccessPage';
import { PublicGalleryAlbumPage } from '@/pages/public/PublicGalleryAlbumPage';
import { PublicGalleryPage } from '@/pages/public/PublicGalleryPage';
import { PublicHomePage } from '@/pages/public/PublicHomePage';
import { PublicMissionPage } from '@/pages/public/PublicMissionPage';
import { PublicProjectsPage } from '@/pages/public/PublicProjectsPage';
import { PublicTeamPage } from '@/pages/public/PublicTeamPage';
import { PublicVolunteerPage } from '@/pages/public/PublicVolunteerPage';
import { VolunteerApplicationsPage } from '@/pages/admin/volunteer/VolunteerApplicationsPage';

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
        element: <PublicAboutIndexPage />,
      },
      {
        path: '/about/:slug',
        element: <PublicAboutSubPage />,
      },
      {
        path: '/team',
        element: <PublicTeamPage />,
      },
      {
        path: '/mission',
        element: <PublicMissionPage />,
      },
      {
        path: '/projects',
        element: <PublicProjectsPage />,
      },
      {
        path: '/campaigns',
        element: <PublicCampaignsPage />,
      },
      {
        path: '/campaigns/:slug',
        element: <PublicCampaignDetailPage />,
      },
      {
        path: '/gallery',
        element: <PublicGalleryPage />,
      },
      {
        path: '/gallery/:slug',
        element: <PublicGalleryAlbumPage />,
      },
      {
        path: '/volunteer',
        element: <PublicVolunteerPage />,
      },
      {
        path: '/contact',
        element: <PublicContactPage />,
      },
      {
        path: '/donate',
        element: <PublicDonatePage />,
      },
      {
        path: '/donate/success',
        element: <PublicDonateSuccessPage />,
      },
      {
        path: '/donate/cancel',
        element: <PublicDonateCancelPage />,
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
          {
            path: 'team',
            element: <TeamMembersPage />,
          },
          {
            path: 'contact',
            element: <ContactSubmissionsPage />,
          },
          {
            path: 'volunteers',
            element: <VolunteerApplicationsPage />,
          },
          {
            path: 'campaigns',
            element: <CampaignsPage />,
          },
          {
            path: 'campaigns/new',
            element: <CampaignCreatePage />,
          },
          {
            path: 'campaigns/:id/edit',
            element: <CampaignEditPage />,
          },
          {
            path: 'gallery',
            element: <GalleryAlbumsPage />,
          },
          {
            path: 'gallery/new',
            element: <GalleryAlbumCreatePage />,
          },
          {
            path: 'gallery/:id/edit',
            element: <GalleryAlbumEditPage />,
          },
          {
            path: 'donations',
            element: <DonationsPage />,
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
