import type { FilterQuery } from 'mongoose';
import { BaseRepository } from './BaseRepository.js';
import { GALLERY_ALBUM_STATUSES, type GalleryAlbumStatus } from '../constants/gallery.js';
import type { IGalleryAlbum } from '../models/GalleryAlbum.model.js';
import { GalleryAlbum } from '../models/GalleryAlbum.model.js';

export type GalleryAlbumListFilters = {
  search?: string;
  status?: GalleryAlbumStatus;
  page?: number;
  limit?: number;
};

export class GalleryAlbumRepository extends BaseRepository<IGalleryAlbum> {
  constructor() {
    super(GalleryAlbum);
  }

  async findWithFilters(filters: GalleryAlbumListFilters) {
    const query: FilterQuery<IGalleryAlbum> = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.search) {
      const searchRegex = new RegExp(filters.search, 'i');
      query.$or = [{ title: searchRegex }, { slug: searchRegex }, { description: searchRegex }];
    }

    return this.findPaginated(query, {
      page: filters.page,
      limit: filters.limit,
      sort: 'sortOrder',
      order: 'asc',
    });
  }

  async findPublished() {
    return this.model
      .find({ status: GALLERY_ALBUM_STATUSES.PUBLISHED })
      .sort({ sortOrder: 1, createdAt: -1 })
      .exec();
  }

  async findPublishedBySlug(slug: string) {
    return this.model
      .findOne({
        slug: slug.toLowerCase(),
        status: GALLERY_ALBUM_STATUSES.PUBLISHED,
      })
      .exec();
  }

  async isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
    const query: FilterQuery<IGalleryAlbum> = { slug: slug.toLowerCase() };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    return Boolean(await this.model.exists(query).exec());
  }
}

export const galleryAlbumRepository = new GalleryAlbumRepository();
