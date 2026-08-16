import type { FilterQuery } from 'mongoose';
import { BaseRepository } from './BaseRepository.js';
import type { VolunteerApplicationStatus } from '../constants/volunteer.js';
import type { IVolunteerApplication } from '../models/VolunteerApplication.model.js';
import { VolunteerApplication } from '../models/VolunteerApplication.model.js';

export type VolunteerApplicationListFilters = {
  search?: string;
  status?: VolunteerApplicationStatus;
  page?: number;
  limit?: number;
};

export class VolunteerApplicationRepository extends BaseRepository<IVolunteerApplication> {
  constructor() {
    super(VolunteerApplication);
  }

  async findWithFilters(filters: VolunteerApplicationListFilters) {
    const query: FilterQuery<IVolunteerApplication> = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.search) {
      const searchRegex = new RegExp(filters.search, 'i');
      query.$or = [
        { fullName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { city: searchRegex },
        { interests: searchRegex },
        { message: searchRegex },
      ];
    }

    return this.findPaginated(query, {
      page: filters.page,
      limit: filters.limit,
      sort: 'createdAt',
      order: 'desc',
    });
  }

  async countByStatus(status: VolunteerApplicationStatus): Promise<number> {
    return this.model.countDocuments({ status }).exec();
  }
}

export const volunteerApplicationRepository = new VolunteerApplicationRepository();
