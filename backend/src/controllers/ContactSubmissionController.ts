import type { Request, Response } from 'express';
import { BaseController } from './BaseController.js';
import { contactSubmissionService } from '../services/ContactSubmissionService.js';
import type {
  ContactSubmissionListQuery,
  CreateContactSubmissionInput,
} from '../schemas/contact.schema.js';

class ContactSubmissionController extends BaseController {
  create = async (req: Request, res: Response): Promise<void> => {
    const input = req.body as CreateContactSubmissionInput;
    const submission = await contactSubmissionService.create(input);
    this.sendCreated(res, submission, 'Your message has been sent successfully');
  };

  list = async (req: Request, res: Response): Promise<void> => {
    const query = req.validatedQuery as ContactSubmissionListQuery;
    const result = await contactSubmissionService.list({
      search: query.search,
      status: query.status,
      page: query.page,
      limit: query.limit,
    });

    this.sendPaginated(res, result.data, result.pagination, 'Contact submissions retrieved successfully');
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.validatedParams as { id: string };
    const submission = await contactSubmissionService.getByIdAndMarkRead(id);
    this.sendSuccess(res, submission, { message: 'Contact submission retrieved successfully' });
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.validatedParams as { id: string };
    await contactSubmissionService.remove(id);
    this.sendSuccess(res, null, { message: 'Contact submission deleted successfully' });
  };

  countNew = async (_req: Request, res: Response): Promise<void> => {
    const count = await contactSubmissionService.countNew();
    this.sendSuccess(res, { count }, { message: 'New contact submission count retrieved successfully' });
  };
}

export const contactSubmissionController = new ContactSubmissionController();
