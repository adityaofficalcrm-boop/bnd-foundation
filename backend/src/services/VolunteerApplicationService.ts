import { VOLUNTEER_APPLICATION_STATUSES } from '../constants/volunteer.js';
import { volunteerApplicationRepository } from '../repositories/VolunteerApplicationRepository.js';
import { BaseService } from './BaseService.js';
import type { CreateVolunteerApplicationInput } from '../schemas/volunteer.schema.js';
import type { IVolunteerApplication } from '../models/VolunteerApplication.model.js';
import type { VolunteerApplicationStatus } from '../constants/volunteer.js';
import { toVolunteerApplicationResponse } from '../types/volunteer.types.js';

export type VolunteerApplicationListParams = {
  search?: string;
  status?: VolunteerApplicationStatus;
  page?: number;
  limit?: number;
};

class VolunteerApplicationService extends BaseService<IVolunteerApplication> {
  constructor() {
    super(volunteerApplicationRepository);
  }

  async create(input: CreateVolunteerApplicationInput) {
    const application = await volunteerApplicationRepository.create({
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      city: input.city?.trim() || undefined,
      country: input.country?.trim() || undefined,
      interests: input.interests,
      availability: input.availability?.trim() || undefined,
      message: input.message,
      status: VOLUNTEER_APPLICATION_STATUSES.NEW,
    });

    return toVolunteerApplicationResponse(application);
  }

  async list(params: VolunteerApplicationListParams) {
    const result = await volunteerApplicationRepository.findWithFilters(params);

    return {
      data: result.data.map(toVolunteerApplicationResponse),
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }

  async getByIdAndMarkReviewed(id: string) {
    const application = await this.getByIdOrFail(id, 'Volunteer application not found');

    if (application.status === VOLUNTEER_APPLICATION_STATUSES.NEW) {
      application.status = VOLUNTEER_APPLICATION_STATUSES.REVIEWED;
      await application.save();
    }

    return toVolunteerApplicationResponse(application);
  }

  async remove(id: string) {
    await volunteerApplicationRepository.deleteByIdOrFail(id, 'Volunteer application not found');
  }

  async countNew() {
    return volunteerApplicationRepository.countByStatus(VOLUNTEER_APPLICATION_STATUSES.NEW);
  }
}

export const volunteerApplicationService = new VolunteerApplicationService();
