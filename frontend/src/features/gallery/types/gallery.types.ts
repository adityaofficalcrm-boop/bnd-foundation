export const GALLERY_ALBUM_STATUSES = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
} as const;

export type GalleryAlbumStatus =
  (typeof GALLERY_ALBUM_STATUSES)[keyof typeof GALLERY_ALBUM_STATUSES];

export const GALLERY_ALBUM_STATUS_LABELS: Record<GalleryAlbumStatus, string> = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
};

export const GALLERY_MEDIA_TYPES = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
} as const;

export type GalleryMediaType = (typeof GALLERY_MEDIA_TYPES)[keyof typeof GALLERY_MEDIA_TYPES];

export type GalleryItem = {
  id: string;
  albumId: string;
  mediaType: GalleryMediaType;
  url: string;
  title?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type GalleryAlbum = {
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

export type GalleryAlbumDetail = GalleryAlbum & {
  items: GalleryItem[];
};

export type GalleryAlbumListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: GalleryAlbumStatus;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
  meta?: {
    pagination?: PaginationMeta;
  };
};
