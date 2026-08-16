import { Router } from 'express';
import { contactSubmissionController } from '../../controllers/ContactSubmissionController.js';
import { USER_ROLES } from '../../constants/roles.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import {
  contactSubmissionIdParamSchema,
  contactSubmissionListQuerySchema,
  createContactSubmissionSchema,
} from '../../schemas/contact.schema.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const contactRouter = Router();

contactRouter.post(
  '/',
  validate({ body: createContactSubmissionSchema }),
  asyncHandler(contactSubmissionController.create),
);

contactRouter.use(authenticate, authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN));

contactRouter.get(
  '/',
  validate({ query: contactSubmissionListQuerySchema }),
  asyncHandler(contactSubmissionController.list),
);

contactRouter.get('/stats/new-count', asyncHandler(contactSubmissionController.countNew));

contactRouter.get(
  '/:id',
  validate({ params: contactSubmissionIdParamSchema }),
  asyncHandler(contactSubmissionController.getById),
);

contactRouter.delete(
  '/:id',
  validate({ params: contactSubmissionIdParamSchema }),
  asyncHandler(contactSubmissionController.remove),
);
