export type DashboardActivityItem = {
  id: string;
  type: 'donation' | 'contact' | 'volunteer';
  title: string;
  subtitle: string;
  status: string;
  createdAt: string;
};

export type DashboardStats = {
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

export type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};
