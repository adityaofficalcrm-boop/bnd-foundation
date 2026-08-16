import { Schema, model, type Document, type Model } from 'mongoose';
import {
  GALLERY_ALBUM_STATUSES,
  type GalleryAlbumStatus,
} from '../constants/gallery.js';

export interface IGalleryAlbum extends Document {
  title: string;
  slug: string;
  description?: string;
  coverImageUrl?: string;
  status: GalleryAlbumStatus;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const galleryAlbumSchema = new Schema<IGalleryAlbum>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 200,
      unique: true,
      index: true,
    },
    description: { type: String, trim: true, maxlength: 2000 },
    coverImageUrl: { type: String, trim: true, maxlength: 1000 },
    status: {
      type: String,
      enum: Object.values(GALLERY_ALBUM_STATUSES),
      default: GALLERY_ALBUM_STATUSES.DRAFT,
      index: true,
    },
    sortOrder: { type: Number, default: 0, index: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

galleryAlbumSchema.index({ status: 1, sortOrder: 1, createdAt: -1 });

export const GalleryAlbum: Model<IGalleryAlbum> = model<IGalleryAlbum>(
  'GalleryAlbum',
  galleryAlbumSchema,
);
