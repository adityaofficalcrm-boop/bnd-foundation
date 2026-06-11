import { Router } from 'express';
import { authController } from '../../controllers/AuthController.js';
import { authenticate } from '../../middleware/authenticate.js';
import { validate } from '../../middleware/validate.js';
import { loginSchema, logoutSchema, refreshTokenSchema } from '../../schemas/auth.schema.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const authRouter = Router();

authRouter.post('/login', validate({ body: loginSchema }), asyncHandler(authController.login));

authRouter.post(
  '/refresh',
  validate({ body: refreshTokenSchema }),
  asyncHandler(authController.refresh),
);

authRouter.post(
  '/logout',
  validate({ body: logoutSchema }),
  asyncHandler(authController.logout),
);

authRouter.get('/me', authenticate, asyncHandler(authController.me));
