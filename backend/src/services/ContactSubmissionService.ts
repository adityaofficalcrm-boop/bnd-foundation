import { CONTACT_SUBMISSION_STATUSES } from '../constants/contact.js';
import { contactSubmissionRepository } from '../repositories/ContactSubmissionRepository.js';
import { BaseService } from './BaseService.js';
import type { CreateContactSubmissionInput } from '../schemas/contact.schema.js';
import type { IContactSubmission } from '../models/ContactSubmission.model.js';
import { toContactSubmissionResponse } from '../types/contact.types.js';
import { verifyRecaptchaToken } from '../utils/recaptcha.js';

export type ContactSubmissionListParams = {
  search?: string;
  status?: (typeof CONTACT_SUBMISSION_STATUSES)[keyof typeof CONTACT_SUBMISSION_STATUSES];
  page?: number;
  limit?: number;
};

class ContactSubmissionService extends BaseService<IContactSubmission> {
  constructor() {
    super(contactSubmissionRepository);
  }

  async create(input: CreateContactSubmissionInput) {
    await verifyRecaptchaToken(input.recaptchaToken);

    const submission = await contactSubmissionRepository.create({
      name: input.name,
      email: input.email,
      phone: input.phone,
      company: input.company?.trim() || undefined,
      message: input.message,
      status: CONTACT_SUBMISSION_STATUSES.NEW,
    });

    return toContactSubmissionResponse(submission);
  }

  async list(params: ContactSubmissionListParams) {
    const result = await contactSubmissionRepository.findWithFilters(params);

    return {
      data: result.data.map(toContactSubmissionResponse),
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }

  async getById(id: string) {
    const submission = await this.getByIdOrFail(id, 'Contact submission not found');
    return toContactSubmissionResponse(submission);
  }

  async getByIdAndMarkRead(id: string) {
    const submission = await this.getByIdOrFail(id, 'Contact submission not found');

    if (submission.status === CONTACT_SUBMISSION_STATUSES.NEW) {
      submission.status = CONTACT_SUBMISSION_STATUSES.READ;
      await submission.save();
    }

    return toContactSubmissionResponse(submission);
  }

  async remove(id: string) {
    await contactSubmissionRepository.deleteByIdOrFail(id, 'Contact submission not found');
  }

  async countNew() {
    return contactSubmissionRepository.countByStatus(CONTACT_SUBMISSION_STATUSES.NEW);
  }
}

export const contactSubmissionService = new ContactSubmissionService();
