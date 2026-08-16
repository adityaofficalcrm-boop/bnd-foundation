import type { VolunteerApplicationStatus } from '../constants/volunteer.js';
import type { IVolunteerApplication } from '../models/VolunteerApplication.model.js';

export type VolunteerApplicationResponse = {
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

export function toVolunteerApplicationResponse(
  application: IVolunteerApplication,
): VolunteerApplicationResponse {
  return {
    id: application.id,
    fullName: application.fullName,
    email: application.email,
    phone: application.phone,
    city: application.city || undefined,
    country: application.country || undefined,
    interests: application.interests,
    availability: application.availability || undefined,
    message: application.message,
    status: application.status,
    createdAt: application.createdAt.toISOString(),
    updatedAt: application.updatedAt.toISOString(),
  };
}
