export const CONTACT_SUBMISSION_STATUSES = {
  NEW: 'NEW',
  READ: 'READ',
} as const;

export type ContactSubmissionStatus =
  (typeof CONTACT_SUBMISSION_STATUSES)[keyof typeof CONTACT_SUBMISSION_STATUSES];

export const CONTACT_SUBMISSION_STATUS_VALUES = Object.values(CONTACT_SUBMISSION_STATUSES);
