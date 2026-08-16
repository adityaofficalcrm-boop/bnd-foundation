import { Router } from 'express';
import { donationController } from '../../controllers/DonationController.js';
import { USER_ROLES } from '../../constants/roles.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import {
  createDonationSchema,
  donationIdParamSchema,
  donationListQuerySchema,
} from '../../schemas/donation.schema.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const donationRouter = Router();

donationRouter.post(
  '/',
  validate({ body: createDonationSchema }),
  asyncHandler(donationController.create),
);

donationRouter.get('/confirm', asyncHandler(donationController.confirm));
donationRouter.get('/public/recent', asyncHandler(donationController.getRecentPublic));
donationRouter.get('/public/top-donors', asyncHandler(donationController.getTopDonorsPublic));

donationRouter.use(authenticate, authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN));

donationRouter.get(
  '/',
  validate({ query: donationListQuerySchema }),
  asyncHandler(donationController.list),
);

donationRouter.get('/stats/pending-count', asyncHandler(donationController.countPending));

donationRouter.get(
  '/:id',
  validate({ params: donationIdParamSchema }),
  asyncHandler(donationController.getById),
);

donationRouter.delete(
  '/:id',
  validate({ params: donationIdParamSchema }),
  asyncHandler(donationController.remove),
);
