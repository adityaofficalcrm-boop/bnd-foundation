import { Router } from 'express';
import { cmsController } from '../../controllers/CmsController.js';
import { USER_ROLES } from '../../constants/roles.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import {
  cmsIdParamSchema,
  cmsListQuerySchema,
  cmsPublicSectionParamSchema,
  createCmsSchema,
  updateCmsSchema,
} from '../../schemas/cms.schema.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const cmsRouter = Router();

cmsRouter.get('/public', asyncHandler(cmsController.listPublic));

cmsRouter.get(
  '/public/:section',
  validate({ params: cmsPublicSectionParamSchema }),
  asyncHandler(cmsController.getPublicBySection),
);

cmsRouter.use(authenticate, authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN));

cmsRouter.get(
  '/',
  validate({ query: cmsListQuerySchema }),
  asyncHandler(cmsController.list),
);

cmsRouter.get(
  '/:id',
  validate({ params: cmsIdParamSchema }),
  asyncHandler(cmsController.getById),
);

cmsRouter.post('/', validate({ body: createCmsSchema }), asyncHandler(cmsController.create));

cmsRouter.put(
  '/:id',
  validate({ params: cmsIdParamSchema, body: updateCmsSchema }),
  asyncHandler(cmsController.update),
);

cmsRouter.delete(
  '/:id',
  validate({ params: cmsIdParamSchema }),
  asyncHandler(cmsController.remove),
);
