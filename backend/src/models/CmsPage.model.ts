import { Schema, model, type Document, type Types } from 'mongoose';
import {
  CMS_SECTION_VALUES,
  CMS_STATUS_VALUES,
  type CmsSection,
  type CmsStatus,
} from '../constants/cms.js';

export interface ICmsMeta {
  email?: string;
  phone?: string;
  address?: string;
  copyright?: string;
  socialFacebook?: string;
  socialTwitter?: string;
  socialInstagram?: string;
  socialLinkedin?: string;
  socialYoutube?: string;
  supportCredit?: string;
  role?: string;
  group?: string;
  amount?: string;
  location?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  grantProvider?: string;
}

export interface ICmsPage extends Document {
  section: CmsSection;
  title: string;
  slug: string;
  heading?: string;
  subheading?: string;
  body: string;
  imageUrl?: string;
  meta?: ICmsMeta;
  status: CmsStatus;
  sortOrder: number;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const cmsMetaSchema = new Schema<ICmsMeta>(
  {
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    copyright: { type: String, trim: true },
    socialFacebook: { type: String, trim: true },
    socialTwitter: { type: String, trim: true },
    socialInstagram: { type: String, trim: true },
    socialLinkedin: { type: String, trim: true },
    socialYoutube: { type: String, trim: true },
    supportCredit: { type: String, trim: true, maxlength: 200 },
    role: { type: String, trim: true, maxlength: 120 },
    group: { type: String, trim: true, maxlength: 80 },
    amount: { type: String, trim: true, maxlength: 50 },
    location: { type: String, trim: true, maxlength: 200 },
    ctaLabel: { type: String, trim: true, maxlength: 120 },
    ctaUrl: { type: String, trim: true, maxlength: 500 },
    grantProvider: { type: String, trim: true, maxlength: 200 },
  },
  { _id: false },
);

const cmsPageSchema = new Schema<ICmsPage>(
  {
    section: {
      type: String,
      enum: CMS_SECTION_VALUES,
      required: [true, 'Section is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    heading: { type: String, trim: true, maxlength: 300 },
    subheading: { type: String, trim: true, maxlength: 500 },
    body: {
      type: String,
      required: [true, 'Body content is required'],
      trim: true,
    },
    imageUrl: { type: String, trim: true },
    meta: { type: cmsMetaSchema, default: undefined },
    status: {
      type: String,
      enum: CMS_STATUS_VALUES,
      default: 'DRAFT',
      index: true,
    },
    sortOrder: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    publishedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  },
);

cmsPageSchema.index({ title: 'text', slug: 'text', body: 'text' });
cmsPageSchema.index({ section: 1, status: 1 });

export const CmsPage = model<ICmsPage>('CmsPage', cmsPageSchema);
