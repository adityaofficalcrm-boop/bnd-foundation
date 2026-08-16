import type { Request, Response } from 'express';
import { BaseController } from './BaseController.js';
import { campaignService } from '../services/CampaignService.js';
import type {
  CampaignListQuery,
  CreateCampaignInput,
  UpdateCampaignInput,
} from '../schemas/campaign.schema.js';

class CampaignController extends BaseController {
  create = async (req: Request, res: Response): Promise<void> => {
    const input = req.body as CreateCampaignInput;
    const campaign = await campaignService.create(input);
    this.sendCreated(res, campaign, 'Campaign created successfully');
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.validatedParams as { id: string };
    const input = req.body as UpdateCampaignInput;
    const campaign = await campaignService.update(id, input);
    this.sendSuccess(res, campaign, { message: 'Campaign updated successfully' });
  };

  list = async (req: Request, res: Response): Promise<void> => {
    const query = req.validatedQuery as CampaignListQuery;
    const result = await campaignService.list({
      search: query.search,
      status: query.status,
      page: query.page,
      limit: query.limit,
    });

    this.sendPaginated(res, result.data, result.pagination, 'Campaigns retrieved successfully');
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.validatedParams as { id: string };
    const campaign = await campaignService.getById(id);
    this.sendSuccess(res, campaign, { message: 'Campaign retrieved successfully' });
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.validatedParams as { id: string };
    await campaignService.remove(id);
    this.sendSuccess(res, null, { message: 'Campaign deleted successfully' });
  };

  listPublic = async (_req: Request, res: Response): Promise<void> => {
    const campaigns = await campaignService.listPublic();
    this.sendSuccess(res, campaigns, { message: 'Public campaigns retrieved successfully' });
  };

  getPublicBySlug = async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.validatedParams as { slug: string };
    const campaign = await campaignService.getPublicBySlug(slug);
    this.sendSuccess(res, campaign, { message: 'Campaign retrieved successfully' });
  };
}

export const campaignController = new CampaignController();
