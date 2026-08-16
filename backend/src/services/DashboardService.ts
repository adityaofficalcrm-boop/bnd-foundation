import { CAMPAIGN_STATUSES } from '../constants/campaign.js';
import { CONTACT_SUBMISSION_STATUSES } from '../constants/contact.js';
import { DONATION_STATUSES } from '../constants/donation.js';
import { GALLERY_ALBUM_STATUSES } from '../constants/gallery.js';
import { VOLUNTEER_APPLICATION_STATUSES } from '../constants/volunteer.js';
import { contactSubmissionRepository } from '../repositories/ContactSubmissionRepository.js';
import { donationRepository } from '../repositories/DonationRepository.js';
import { volunteerApplicationRepository } from '../repositories/VolunteerApplicationRepository.js';
import { GalleryAlbum } from '../models/GalleryAlbum.model.js';
import { Campaign } from '../models/Campaign.model.js';

export type DashboardActivityItem = {
  id: string;
  type: 'donation' | 'contact' | 'volunteer';
  title: string;
  subtitle: string;
  status: string;
  createdAt: string;
};

export type DashboardStatsResponse = {
  donations: {
    totalPaidCents: number;
    monthPaidCents: number;
    yearPaidCents: number;
    paidCount: number;
    pendingCount: number;
    donorCount: number;
  };
  contacts: {
    newCount: number;
    totalCount: number;
  };
  volunteers: {
    newCount: number;
    totalCount: number;
  };
  campaigns: {
    activeCount: number;
    totalCount: number;
  };
  gallery: {
    publishedAlbumCount: number;
  };
  monthlyDonations: {
    label: string;
    totalCents: number;
  }[];
  recentActivity: DashboardActivityItem[];
};

function startOfUtcMonth(date = new Date()): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function startOfUtcYear(date = new Date()): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

class DashboardService {
  async getStats(): Promise<DashboardStatsResponse> {
    const monthStart = startOfUtcMonth();
    const yearStart = startOfUtcYear();

    const [
      totalPaidCents,
      monthPaidCents,
      yearPaidCents,
      paidCount,
      pendingCount,
      donorCount,
      newContacts,
      totalContacts,
      newVolunteers,
      totalVolunteers,
      activeCampaigns,
      totalCampaigns,
      publishedAlbums,
      monthlySeries,
      recentDonations,
      recentContacts,
      recentVolunteers,
    ] = await Promise.all([
      donationRepository.sumPaidAmountCents(),
      donationRepository.sumPaidAmountCentsSince(monthStart),
      donationRepository.sumPaidAmountCentsSince(yearStart),
      donationRepository.countByStatus(DONATION_STATUSES.PAID),
      donationRepository.countByStatus(DONATION_STATUSES.PENDING),
      donationRepository.countPaidDonors(),
      contactSubmissionRepository.countByStatus(CONTACT_SUBMISSION_STATUSES.NEW),
      contactSubmissionRepository.count({}),
      volunteerApplicationRepository.countByStatus(VOLUNTEER_APPLICATION_STATUSES.NEW),
      volunteerApplicationRepository.count({}),
      Campaign.countDocuments({ status: CAMPAIGN_STATUSES.ACTIVE }).exec(),
      Campaign.countDocuments({}).exec(),
      GalleryAlbum.countDocuments({ status: GALLERY_ALBUM_STATUSES.PUBLISHED }).exec(),
      donationRepository.monthlyPaidTotals(6),
      donationRepository.findRecent(5),
      contactSubmissionRepository.findPaginated({}, { page: 1, limit: 5, sort: 'createdAt', order: 'desc' }),
      volunteerApplicationRepository.findPaginated(
        {},
        { page: 1, limit: 5, sort: 'createdAt', order: 'desc' },
      ),
    ]);

    const monthlyDonations = monthlySeries.map((row) => ({
      label: `${MONTH_LABELS[row.month - 1]} ${String(row.year).slice(2)}`,
      totalCents: row.totalCents,
    }));

    const recentActivity: DashboardActivityItem[] = [
      ...recentDonations.map((donation) => ({
        id: `donation-${donation.id}`,
        type: 'donation' as const,
        title: `${donation.donorName} donated`,
        subtitle: `$${(donation.amountCents / 100).toFixed(2)} AUD`,
        status: donation.status,
        createdAt: donation.createdAt.toISOString(),
      })),
      ...recentContacts.data.map((contact) => ({
        id: `contact-${contact.id}`,
        type: 'contact' as const,
        title: `Message from ${contact.name}`,
        subtitle: contact.email,
        status: contact.status,
        createdAt: contact.createdAt.toISOString(),
      })),
      ...recentVolunteers.data.map((application) => ({
        id: `volunteer-${application.id}`,
        type: 'volunteer' as const,
        title: `Volunteer: ${application.fullName}`,
        subtitle: application.interests,
        status: application.status,
        createdAt: application.createdAt.toISOString(),
      })),
    ]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    return {
      donations: {
        totalPaidCents,
        monthPaidCents,
        yearPaidCents,
        paidCount,
        pendingCount,
        donorCount,
      },
      contacts: {
        newCount: newContacts,
        totalCount: totalContacts,
      },
      volunteers: {
        newCount: newVolunteers,
        totalCount: totalVolunteers,
      },
      campaigns: {
        activeCount: activeCampaigns,
        totalCount: totalCampaigns,
      },
      gallery: {
        publishedAlbumCount: publishedAlbums,
      },
      monthlyDonations,
      recentActivity,
    };
  }
}

export const dashboardService = new DashboardService();
