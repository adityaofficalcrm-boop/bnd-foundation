import { Router } from 'express';
import { campaignController } from '../../controllers/CampaignController.js';
import { USER_ROLES } from '../../constants/roles.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import {
  campaignIdParamSchema,
  campaignListQuerySchema,
  campaignSlugParamSchema,
  createCampaignSchema,
  updateCampaignSchema,
} from '../../schemas/campaign.schema.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const campaignRouter = Router();

campaignRouter.get('/public', asyncHandler(campaignController.listPublic));

campaignRouter.get(
  '/public/:slug',
  validate({ params: campaignSlugParamSchema }),
  asyncHandler(campaignController.getPublicBySlug),
);

campaignRouter.use(authenticate, authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN));

campaignRouter.get(
  '/',
  validate({ query: campaignListQuerySchema }),
  asyncHandler(campaignController.list),
);

campaignRouter.get(
  '/:id',
  validate({ params: campaignIdParamSchema }),
  asyncHandler(campaignController.getById),
);

campaignRouter.post(
  '/',
  validate({ body: createCampaignSchema }),
  asyncHandler(campaignController.create),
);

campaignRouter.put(
  '/:id',
  validate({ params: campaignIdParamSchema, body: updateCampaignSchema }),
  asyncHandler(campaignController.update),
);

campaignRouter.delete(
  '/:id',
  validate({ params: campaignIdParamSchema }),
  asyncHandler(campaignController.remove),
);
