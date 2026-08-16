export const CONTACT_SUBMISSION_STATUSES = {
  NEW: 'NEW',
  READ: 'READ',
} as const;

export type ContactSubmissionStatus =
  (typeof CONTACT_SUBMISSION_STATUSES)[keyof typeof CONTACT_SUBMISSION_STATUSES];

export const CONTACT_SUBMISSION_STATUS_LABELS: Record<ContactSubmissionStatus, string> = {
  NEW: 'New',
  READ: 'Read',
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  message: string;
  status: ContactSubmissionStatus;
  createdAt: string;
  updatedAt: string;
};

export type ContactSubmissionListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: ContactSubmissionStatus;
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
