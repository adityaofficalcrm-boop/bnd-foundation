import { Router } from 'express';
import { dashboardController } from '../../controllers/DashboardController.js';
import { USER_ROLES } from '../../constants/roles.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const dashboardRouter = Router();

dashboardRouter.use(authenticate, authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN));

dashboardRouter.get('/stats', asyncHandler(dashboardController.getStats));
