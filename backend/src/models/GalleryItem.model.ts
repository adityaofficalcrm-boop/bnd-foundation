import { Schema, model, type Document, type Model, type Types } from 'mongoose';
import { GALLERY_MEDIA_TYPES, type GalleryMediaType } from '../constants/gallery.js';

export interface IGalleryItem extends Document {
  albumId: Types.ObjectId;
  mediaType: GalleryMediaType;
  url: string;
  title?: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const galleryItemSchema = new Schema<IGalleryItem>(
  {
    albumId: {
      type: Schema.Types.ObjectId,
      ref: 'GalleryAlbum',
      required: true,
      index: true,
    },
    mediaType: {
      type: String,
      enum: Object.values(GALLERY_MEDIA_TYPES),
      required: true,
    },
    url: { type: String, required: true, trim: true, maxlength: 1000 },
    title: { type: String, trim: true, maxlength: 200 },
    sortOrder: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

galleryItemSchema.index({ albumId: 1, sortOrder: 1, createdAt: -1 });

export const GalleryItem: Model<IGalleryItem> = model<IGalleryItem>(
  'GalleryItem',
  galleryItemSchema,
);
