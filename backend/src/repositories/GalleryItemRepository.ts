import { BaseRepository } from './BaseRepository.js';
import type { IGalleryItem } from '../models/GalleryItem.model.js';
import { GalleryItem } from '../models/GalleryItem.model.js';

export class GalleryItemRepository extends BaseRepository<IGalleryItem> {
  constructor() {
    super(GalleryItem);
  }

  async findByAlbumId(albumId: string) {
    return this.model.find({ albumId }).sort({ sortOrder: 1, createdAt: -1 }).exec();
  }

  async countByAlbumId(albumId: string): Promise<number> {
    return this.model.countDocuments({ albumId }).exec();
  }

  async deleteByAlbumId(albumId: string): Promise<void> {
    await this.model.deleteMany({ albumId }).exec();
  }
}

export const galleryItemRepository = new GalleryItemRepository();
