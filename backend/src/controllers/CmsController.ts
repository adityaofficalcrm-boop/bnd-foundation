import type { Request, Response } from 'express';
import { BaseController } from './BaseController.js';
import { cmsService } from '../services/CmsService.js';
import type { CreateCmsInput, CmsListQuery, CmsPublicSectionParam, UpdateCmsInput } from '../schemas/cms.schema.js';

class CmsController extends BaseController {
  list = async (req: Request, res: Response): Promise<void> => {
    const query = req.validatedQuery as CmsListQuery;
    const result = await cmsService.list({
      search: query.search,
      section: query.section,
      status: query.status,
      page: query.page,
      limit: query.limit,
    });

    this.sendPaginated(res, result.data, result.pagination, 'CMS pages retrieved successfully');
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.validatedParams as { id: string };
    const page = await cmsService.getById(id);
    this.sendSuccess(res, page, { message: 'CMS page retrieved successfully' });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const input = req.body as CreateCmsInput;
    const page = await cmsService.create(input, req.user!.id);
    this.sendCreated(res, page, 'CMS page created successfully');
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.validatedParams as { id: string };
    const input = req.body as UpdateCmsInput;
    const page = await cmsService.update(id, input, req.user!.id);
    this.sendSuccess(res, page, { message: 'CMS page updated successfully' });
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.validatedParams as { id: string };
    await cmsService.remove(id);
    this.sendSuccess(res, null, { message: 'CMS page deleted successfully' });
  };

  listPublic = async (_req: Request, res: Response): Promise<void> => {
    const pages = await cmsService.listPublic();
    this.sendSuccess(res, pages, { message: 'Published CMS content retrieved successfully' });
  };

  getPublicBySection = async (req: Request, res: Response): Promise<void> => {
    const { section } = req.validatedParams as CmsPublicSectionParam;
    const pages = await cmsService.getPublicBySection(section);
    this.sendSuccess(res, pages, { message: 'Published CMS content retrieved successfully' });
  };
}

export const cmsController = new CmsController();
