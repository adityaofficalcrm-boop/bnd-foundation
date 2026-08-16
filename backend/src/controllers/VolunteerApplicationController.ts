import type { Request, Response } from 'express';
import { BaseController } from './BaseController.js';
import { volunteerApplicationService } from '../services/VolunteerApplicationService.js';
import type {
  CreateVolunteerApplicationInput,
  VolunteerApplicationListQuery,
} from '../schemas/volunteer.schema.js';

class VolunteerApplicationController extends BaseController {
  create = async (req: Request, res: Response): Promise<void> => {
    const input = req.body as CreateVolunteerApplicationInput;
    const application = await volunteerApplicationService.create(input);
    this.sendCreated(
      res,
      application,
      'Thank you for applying. We will be in touch soon.',
    );
  };

  list = async (req: Request, res: Response): Promise<void> => {
    const query = req.validatedQuery as VolunteerApplicationListQuery;
    const result = await volunteerApplicationService.list({
      search: query.search,
      status: query.status,
      page: query.page,
      limit: query.limit,
    });

    this.sendPaginated(
      res,
      result.data,
      result.pagination,
      'Volunteer applications retrieved successfully',
    );
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.validatedParams as { id: string };
    const application = await volunteerApplicationService.getByIdAndMarkReviewed(id);
    this.sendSuccess(res, application, { message: 'Volunteer application retrieved successfully' });
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.validatedParams as { id: string };
    await volunteerApplicationService.remove(id);
    this.sendSuccess(res, null, { message: 'Volunteer application deleted successfully' });
  };

  countNew = async (_req: Request, res: Response): Promise<void> => {
    const count = await volunteerApplicationService.countNew();
    this.sendSuccess(res, { count }, { message: 'New volunteer application count retrieved' });
  };
}

export const volunteerApplicationController = new VolunteerApplicationController();
