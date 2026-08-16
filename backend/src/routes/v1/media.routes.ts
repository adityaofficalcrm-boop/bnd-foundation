import { Router } from 'express';
import { USER_ROLES } from '../../constants/roles.js';
import { mediaController } from '../../controllers/MediaController.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { imageUpload, videoUpload } from '../../middleware/upload.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const mediaRouter = Router();

mediaRouter.post(
  '/upload',
  authenticate,
  authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  imageUpload.single('file'),
  asyncHandler(mediaController.uploadImage),
);

mediaRouter.post(
  '/upload-video',
  authenticate,
  authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  videoUpload.single('file'),
  asyncHandler(mediaController.uploadVideo),
);
