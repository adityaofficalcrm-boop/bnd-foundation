import type { FilterQuery } from 'mongoose';
import { BaseRepository } from './BaseRepository.js';
import type { ContactSubmissionStatus } from '../constants/contact.js';
import type { IContactSubmission } from '../models/ContactSubmission.model.js';
import { ContactSubmission } from '../models/ContactSubmission.model.js';

export type ContactSubmissionListFilters = {
  search?: string;
  status?: ContactSubmissionStatus;
  page?: number;
  limit?: number;
};

export class ContactSubmissionRepository extends BaseRepository<IContactSubmission> {
  constructor() {
    super(ContactSubmission);
  }

  async findWithFilters(filters: ContactSubmissionListFilters) {
    const query: FilterQuery<IContactSubmission> = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.search) {
      const searchRegex = new RegExp(filters.search, 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { company: searchRegex },
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

  async countByStatus(status: ContactSubmissionStatus): Promise<number> {
    return this.model.countDocuments({ status }).exec();
  }
}

export const contactSubmissionRepository = new ContactSubmissionRepository();
