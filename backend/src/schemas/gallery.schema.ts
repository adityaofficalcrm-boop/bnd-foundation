import { z } from 'zod';
import {
  GALLERY_ALBUM_STATUS_VALUES,
  GALLERY_MEDIA_TYPE_VALUES,
} from '../constants/gallery.js';
import { objectIdSchema, paginationQuerySchema } from '../utils/validation.js';

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 200);
}

export const createGalleryAlbumSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters').max(200),
  slug: z
    .string()
    .trim()
    .max(200)
    .optional()
    .or(z.literal(''))
    .transform((value) => (value ? slugify(value) : undefined)),
  description: z.string().trim().max(2000).optional().or(z.literal('')),
  coverImageUrl: z.string().trim().max(1000).optional().or(z.literal('')),
  status: z.enum(GALLERY_ALBUM_STATUS_VALUES).default('DRAFT'),
  sortOrder: z.coerce.number().int().optional().default(0),
});

export type CreateGalleryAlbumInput = z.infer<typeof createGalleryAlbumSchema>;

export const updateGalleryAlbumSchema = createGalleryAlbumSchema.partial();

export type UpdateGalleryAlbumInput = z.infer<typeof updateGalleryAlbumSchema>;

export const galleryAlbumListQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().max(200).optional(),
  status: z.enum(GALLERY_ALBUM_STATUS_VALUES).optional(),
});

export type GalleryAlbumListQuery = z.infer<typeof galleryAlbumListQuerySchema>;

export const galleryAlbumIdParamSchema = z.object({
  id: objectIdSchema,
});

export const galleryAlbumSlugParamSchema = z.object({
  slug: z.string().trim().min(1).max(200),
});

export const createGalleryItemSchema = z.object({
  mediaType: z.enum(GALLERY_MEDIA_TYPE_VALUES),
  url: z.string().trim().min(1).max(1000),
  title: z.string().trim().max(200).optional().or(z.literal('')),
  sortOrder: z.coerce.number().int().optional().default(0),
});

export type CreateGalleryItemInput = z.infer<typeof createGalleryItemSchema>;

export const updateGalleryItemSchema = z.object({
  title: z.string().trim().max(200).optional().or(z.literal('')),
  sortOrder: z.coerce.number().int().optional(),
  url: z.string().trim().min(1).max(1000).optional(),
});

export type UpdateGalleryItemInput = z.infer<typeof updateGalleryItemSchema>;

export const galleryItemIdParamSchema = z.object({
  id: objectIdSchema,
  itemId: objectIdSchema,
});
