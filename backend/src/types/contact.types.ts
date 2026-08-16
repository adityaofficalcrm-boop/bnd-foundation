import type { ContactSubmissionStatus } from '../constants/contact.js';
import type { IContactSubmission } from '../models/ContactSubmission.model.js';

export type ContactSubmissionResponse = {
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

export function toContactSubmissionResponse(
  submission: IContactSubmission,
): ContactSubmissionResponse {
  return {
    id: submission.id,
    name: submission.name,
    email: submission.email,
    phone: submission.phone,
    company: submission.company || undefined,
    message: submission.message,
    status: submission.status,
    createdAt: submission.createdAt.toISOString(),
    updatedAt: submission.updatedAt.toISOString(),
  };
}
