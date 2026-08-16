import type { Request, Response } from 'express';
import { BaseController } from './BaseController.js';
import { galleryService } from '../services/GalleryService.js';
import type {
  CreateGalleryAlbumInput,
  CreateGalleryItemInput,
  GalleryAlbumListQuery,
  UpdateGalleryAlbumInput,
  UpdateGalleryItemInput,
} from '../schemas/gallery.schema.js';

class GalleryController extends BaseController {
  createAlbum = async (req: Request, res: Response): Promise<void> => {
    const album = await galleryService.createAlbum(req.body as CreateGalleryAlbumInput);
    this.sendCreated(res, album, 'Album created successfully');
  };

  updateAlbum = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.validatedParams as { id: string };
    const album = await galleryService.updateAlbum(id, req.body as UpdateGalleryAlbumInput);
    this.sendSuccess(res, album, { message: 'Album updated successfully' });
  };

  listAlbums = async (req: Request, res: Response): Promise<void> => {
    const query = req.validatedQuery as GalleryAlbumListQuery;
    const result = await galleryService.listAlbums({
      search: query.search,
      status: query.status,
      page: query.page,
      limit: query.limit,
    });
    this.sendPaginated(res, result.data, result.pagination, 'Albums retrieved successfully');
  };

  getAlbum = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.validatedParams as { id: string };
    const album = await galleryService.getAlbumById(id);
    this.sendSuccess(res, album, { message: 'Album retrieved successfully' });
  };

  removeAlbum = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.validatedParams as { id: string };
    await galleryService.removeAlbum(id);
    this.sendSuccess(res, null, { message: 'Album deleted successfully' });
  };

  listPublic = async (_req: Request, res: Response): Promise<void> => {
    const albums = await galleryService.listPublicAlbums();
    this.sendSuccess(res, albums, { message: 'Public albums retrieved successfully' });
  };

  getPublicBySlug = async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.validatedParams as { slug: string };
    const album = await galleryService.getPublicAlbumBySlug(slug);
    this.sendSuccess(res, album, { message: 'Album retrieved successfully' });
  };

  addItem = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.validatedParams as { id: string };
    const item = await galleryService.addItem(id, req.body as CreateGalleryItemInput);
    this.sendCreated(res, item, 'Media item added successfully');
  };

  updateItem = async (req: Request, res: Response): Promise<void> => {
    const { id, itemId } = req.validatedParams as { id: string; itemId: string };
    const item = await galleryService.updateItem(id, itemId, req.body as UpdateGalleryItemInput);
    this.sendSuccess(res, item, { message: 'Media item updated successfully' });
  };

  removeItem = async (req: Request, res: Response): Promise<void> => {
    const { id, itemId } = req.validatedParams as { id: string; itemId: string };
    await galleryService.removeItem(id, itemId);
    this.sendSuccess(res, null, { message: 'Media item deleted successfully' });
  };
}

export const galleryController = new GalleryController();
