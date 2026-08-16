import { z } from 'zod';
import { GALLERY_ALBUM_STATUSES } from '@/features/gallery/types/gallery.types';

export const galleryAlbumFormSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters'),
  slug: z.string().trim().max(200).optional().or(z.literal('')),
  description: z.string().trim().max(2000).optional().or(z.literal('')),
  coverImageUrl: z.string().trim().optional().or(z.literal('')),
  status: z.enum([GALLERY_ALBUM_STATUSES.DRAFT, GALLERY_ALBUM_STATUSES.PUBLISHED]),
  sortOrder: z.number().int().optional(),
});

export type GalleryAlbumFormValues = z.infer<typeof galleryAlbumFormSchema>;
