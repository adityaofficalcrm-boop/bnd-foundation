import { Router } from 'express';
import { volunteerApplicationController } from '../../controllers/VolunteerApplicationController.js';
import { USER_ROLES } from '../../constants/roles.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import {
  createVolunteerApplicationSchema,
  volunteerApplicationIdParamSchema,
  volunteerApplicationListQuerySchema,
} from '../../schemas/volunteer.schema.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const volunteerRouter = Router();

volunteerRouter.post(
  '/',
  validate({ body: createVolunteerApplicationSchema }),
  asyncHandler(volunteerApplicationController.create),
);

volunteerRouter.use(authenticate, authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN));

volunteerRouter.get(
  '/',
  validate({ query: volunteerApplicationListQuerySchema }),
  asyncHandler(volunteerApplicationController.list),
);

volunteerRouter.get('/stats/new-count', asyncHandler(volunteerApplicationController.countNew));

volunteerRouter.get(
  '/:id',
  validate({ params: volunteerApplicationIdParamSchema }),
  asyncHandler(volunteerApplicationController.getById),
);

volunteerRouter.delete(
  '/:id',
  validate({ params: volunteerApplicationIdParamSchema }),
  asyncHandler(volunteerApplicationController.remove),
);
