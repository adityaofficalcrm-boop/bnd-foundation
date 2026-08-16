import { Router } from 'express';
import { galleryController } from '../../controllers/GalleryController.js';
import { USER_ROLES } from '../../constants/roles.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import {
  createGalleryAlbumSchema,
  createGalleryItemSchema,
  galleryAlbumIdParamSchema,
  galleryAlbumListQuerySchema,
  galleryAlbumSlugParamSchema,
  galleryItemIdParamSchema,
  updateGalleryAlbumSchema,
  updateGalleryItemSchema,
} from '../../schemas/gallery.schema.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const galleryRouter = Router();

galleryRouter.get('/public', asyncHandler(galleryController.listPublic));

galleryRouter.get(
  '/public/:slug',
  validate({ params: galleryAlbumSlugParamSchema }),
  asyncHandler(galleryController.getPublicBySlug),
);

galleryRouter.use(authenticate, authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN));

galleryRouter.get(
  '/',
  validate({ query: galleryAlbumListQuerySchema }),
  asyncHandler(galleryController.listAlbums),
);

galleryRouter.post(
  '/',
  validate({ body: createGalleryAlbumSchema }),
  asyncHandler(galleryController.createAlbum),
);

galleryRouter.get(
  '/:id',
  validate({ params: galleryAlbumIdParamSchema }),
  asyncHandler(galleryController.getAlbum),
);

galleryRouter.put(
  '/:id',
  validate({ params: galleryAlbumIdParamSchema, body: updateGalleryAlbumSchema }),
  asyncHandler(galleryController.updateAlbum),
);

galleryRouter.delete(
  '/:id',
  validate({ params: galleryAlbumIdParamSchema }),
  asyncHandler(galleryController.removeAlbum),
);

galleryRouter.post(
  '/:id/items',
  validate({ params: galleryAlbumIdParamSchema, body: createGalleryItemSchema }),
  asyncHandler(galleryController.addItem),
);

galleryRouter.put(
  '/:id/items/:itemId',
  validate({ params: galleryItemIdParamSchema, body: updateGalleryItemSchema }),
  asyncHandler(galleryController.updateItem),
);

galleryRouter.delete(
  '/:id/items/:itemId',
  validate({ params: galleryItemIdParamSchema }),
  asyncHandler(galleryController.removeItem),
);
