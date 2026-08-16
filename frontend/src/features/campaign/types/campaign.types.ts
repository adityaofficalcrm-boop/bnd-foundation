export const CAMPAIGN_STATUSES = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
} as const;

export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[keyof typeof CAMPAIGN_STATUSES];

export const CAMPAIGN_STATUS_LABELS: Record<CampaignStatus, string> = {
  DRAFT: 'Draft',
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
};

export type Campaign = {
  id: string;
  title: string;
  slug: string;
  description: string;
  goalAmountCents: number;
  raisedAmountCents: number;
  coverImageUrl?: string;
  status: CampaignStatus;
  startDate?: string | null;
  endDate?: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type CampaignListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: CampaignStatus;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
  meta?: {
    pagination?: PaginationMeta;
  };
};
