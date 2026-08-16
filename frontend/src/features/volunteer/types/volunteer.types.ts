export const VOLUNTEER_APPLICATION_STATUSES = {
  NEW: 'NEW',
  REVIEWED: 'REVIEWED',
  ARCHIVED: 'ARCHIVED',
} as const;

export type VolunteerApplicationStatus =
  (typeof VOLUNTEER_APPLICATION_STATUSES)[keyof typeof VOLUNTEER_APPLICATION_STATUSES];

export const VOLUNTEER_APPLICATION_STATUS_LABELS: Record<VolunteerApplicationStatus, string> = {
  NEW: 'New',
  REVIEWED: 'Reviewed',
  ARCHIVED: 'Archived',
};

export const VOLUNTEER_INTEREST_OPTIONS = [
  'Education support',
  'Maths mentoring',
  'Healthcare & wellbeing',
  'Clothing & food relief',
  'Events & fundraising',
  'Admin / office support',
  'Other',
] as const;

export type VolunteerApplication = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city?: string;
  country?: string;
  interests: string;
  availability?: string;
  message: string;
  status: VolunteerApplicationStatus;
  createdAt: string;
  updatedAt: string;
};

export type VolunteerApplicationListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: VolunteerApplicationStatus;
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
