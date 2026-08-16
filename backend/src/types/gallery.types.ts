import type { GalleryAlbumStatus, GalleryMediaType } from '../constants/gallery.js';
import type { IGalleryAlbum } from '../models/GalleryAlbum.model.js';
import type { IGalleryItem } from '../models/GalleryItem.model.js';

export type GalleryItemResponse = {
  id: string;
  albumId: string;
  mediaType: GalleryMediaType;
  url: string;
  title?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type GalleryAlbumResponse = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  coverImageUrl?: string;
  status: GalleryAlbumStatus;
  sortOrder: number;
  itemCount?: number;
  createdAt: string;
  updatedAt: string;
};

export type GalleryAlbumDetailResponse = GalleryAlbumResponse & {
  items: GalleryItemResponse[];
};

export function toGalleryItemResponse(item: IGalleryItem): GalleryItemResponse {
  return {
    id: item.id,
    albumId: item.albumId.toString(),
    mediaType: item.mediaType,
    url: item.url,
    title: item.title || undefined,
    sortOrder: item.sortOrder,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}

export function toGalleryAlbumResponse(
  album: IGalleryAlbum,
  itemCount?: number,
): GalleryAlbumResponse {
  return {
    id: album.id,
    title: album.title,
    slug: album.slug,
    description: album.description || undefined,
    coverImageUrl: album.coverImageUrl || undefined,
    status: album.status,
    sortOrder: album.sortOrder,
    itemCount,
    createdAt: album.createdAt.toISOString(),
    updatedAt: album.updatedAt.toISOString(),
  };
}
