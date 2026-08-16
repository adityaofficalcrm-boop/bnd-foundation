export const GALLERY_ALBUM_STATUSES = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
} as const;

export type GalleryAlbumStatus =
  (typeof GALLERY_ALBUM_STATUSES)[keyof typeof GALLERY_ALBUM_STATUSES];

export const GALLERY_ALBUM_STATUS_VALUES = Object.values(GALLERY_ALBUM_STATUSES);

export const GALLERY_MEDIA_TYPES = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
} as const;

export type GalleryMediaType = (typeof GALLERY_MEDIA_TYPES)[keyof typeof GALLERY_MEDIA_TYPES];

export const GALLERY_MEDIA_TYPE_VALUES = Object.values(GALLERY_MEDIA_TYPES);
