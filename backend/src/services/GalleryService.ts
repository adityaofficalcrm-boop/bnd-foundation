import { Types } from 'mongoose';
import { GALLERY_ALBUM_STATUSES } from '../constants/gallery.js';
import { BadRequestError } from '../errors/BadRequestError.js';
import { ConflictError } from '../errors/ConflictError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { galleryAlbumRepository } from '../repositories/GalleryAlbumRepository.js';
import { galleryItemRepository } from '../repositories/GalleryItemRepository.js';
import { BaseService } from './BaseService.js';
import type {
  CreateGalleryAlbumInput,
  CreateGalleryItemInput,
  UpdateGalleryAlbumInput,
  UpdateGalleryItemInput,
} from '../schemas/gallery.schema.js';
import type { IGalleryAlbum } from '../models/GalleryAlbum.model.js';
import type { GalleryAlbumStatus } from '../constants/gallery.js';
import {
  toGalleryAlbumResponse,
  toGalleryItemResponse,
  type GalleryAlbumDetailResponse,
} from '../types/gallery.types.js';

export type GalleryAlbumListParams = {
  search?: string;
  status?: GalleryAlbumStatus;
  page?: number;
  limit?: number;
};

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 200);
}

class GalleryService extends BaseService<IGalleryAlbum> {
  constructor() {
    super(galleryAlbumRepository);
  }

  async createAlbum(input: CreateGalleryAlbumInput) {
    const slug = input.slug || slugify(input.title);
    if (!slug) {
      throw new BadRequestError('Could not generate a valid slug from the title');
    }
    if (await galleryAlbumRepository.isSlugTaken(slug)) {
      throw new ConflictError('An album with this slug already exists');
    }

    const album = await galleryAlbumRepository.create({
      title: input.title,
      slug,
      description: input.description?.trim() || undefined,
      coverImageUrl: input.coverImageUrl?.trim() || undefined,
      status: input.status ?? GALLERY_ALBUM_STATUSES.DRAFT,
      sortOrder: input.sortOrder ?? 0,
    });

    return toGalleryAlbumResponse(album, 0);
  }

  async updateAlbum(id: string, input: UpdateGalleryAlbumInput) {
    const album = await this.getByIdOrFail(id, 'Album not found');

    if (input.title !== undefined) album.title = input.title;
    if (input.description !== undefined) {
      album.description = input.description.trim() || undefined;
    }
    if (input.coverImageUrl !== undefined) {
      album.coverImageUrl = input.coverImageUrl.trim() || undefined;
    }
    if (input.status !== undefined) album.status = input.status;
    if (input.sortOrder !== undefined) album.sortOrder = input.sortOrder;

    if (input.slug !== undefined) {
      const nextSlug = input.slug || slugify(input.title ?? album.title);
      if (!nextSlug) throw new BadRequestError('Could not generate a valid slug');
      if (await galleryAlbumRepository.isSlugTaken(nextSlug, id)) {
        throw new ConflictError('An album with this slug already exists');
      }
      album.slug = nextSlug;
    }

    await album.save();
    const itemCount = await galleryItemRepository.countByAlbumId(id);
    return toGalleryAlbumResponse(album, itemCount);
  }

  async listAlbums(params: GalleryAlbumListParams) {
    const result = await galleryAlbumRepository.findWithFilters(params);
    const data = await Promise.all(
      result.data.map(async (album) => {
        const itemCount = await galleryItemRepository.countByAlbumId(album.id);
        return toGalleryAlbumResponse(album, itemCount);
      }),
    );

    return {
      data,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }

  async getAlbumById(id: string): Promise<GalleryAlbumDetailResponse> {
    const album = await this.getByIdOrFail(id, 'Album not found');
    const items = await galleryItemRepository.findByAlbumId(id);
    return {
      ...toGalleryAlbumResponse(album, items.length),
      items: items.map(toGalleryItemResponse),
    };
  }

  async removeAlbum(id: string) {
    await this.getByIdOrFail(id, 'Album not found');
    await galleryItemRepository.deleteByAlbumId(id);
    await galleryAlbumRepository.deleteByIdOrFail(id, 'Album not found');
  }

  async listPublicAlbums() {
    const albums = await galleryAlbumRepository.findPublished();
    return Promise.all(
      albums.map(async (album) => {
        const itemCount = await galleryItemRepository.countByAlbumId(album.id);
        return toGalleryAlbumResponse(album, itemCount);
      }),
    );
  }

  async getPublicAlbumBySlug(slug: string): Promise<GalleryAlbumDetailResponse> {
    const album = await galleryAlbumRepository.findPublishedBySlug(slug);
    if (!album) {
      throw new NotFoundError('Album not found');
    }
    const items = await galleryItemRepository.findByAlbumId(album.id);
    return {
      ...toGalleryAlbumResponse(album, items.length),
      items: items.map(toGalleryItemResponse),
    };
  }

  async addItem(albumId: string, input: CreateGalleryItemInput) {
    await this.getByIdOrFail(albumId, 'Album not found');

    const item = await galleryItemRepository.create({
      albumId: new Types.ObjectId(albumId),
      mediaType: input.mediaType,
      url: input.url.trim(),
      title: input.title?.trim() || undefined,
      sortOrder: input.sortOrder ?? 0,
    });

    return toGalleryItemResponse(item);
  }

  async updateItem(albumId: string, itemId: string, input: UpdateGalleryItemInput) {
    await this.getByIdOrFail(albumId, 'Album not found');
    const item = await galleryItemRepository.findByIdOrFail(itemId, 'Gallery item not found');

    if (item.albumId.toString() !== albumId) {
      throw new NotFoundError('Gallery item not found in this album');
    }

    if (input.title !== undefined) item.title = input.title.trim() || undefined;
    if (input.sortOrder !== undefined) item.sortOrder = input.sortOrder;
    if (input.url !== undefined) item.url = input.url.trim();

    await item.save();
    return toGalleryItemResponse(item);
  }

  async removeItem(albumId: string, itemId: string) {
    await this.getByIdOrFail(albumId, 'Album not found');
    const item = await galleryItemRepository.findByIdOrFail(itemId, 'Gallery item not found');

    if (item.albumId.toString() !== albumId) {
      throw new NotFoundError('Gallery item not found in this album');
    }

    await galleryItemRepository.deleteByIdOrFail(itemId, 'Gallery item not found');
  }
}

export const galleryService = new GalleryService();
