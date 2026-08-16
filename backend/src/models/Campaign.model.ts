import { Schema, model, type Document, type Model } from 'mongoose';
import { CAMPAIGN_STATUSES, type CampaignStatus } from '../constants/campaign.js';

export interface ICampaign extends Document {
  title: string;
  slug: string;
  description: string;
  goalAmountCents: number;
  raisedAmountCents: number;
  coverImageUrl?: string;
  status: CampaignStatus;
  startDate?: Date | null;
  endDate?: Date | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const campaignSchema = new Schema<ICampaign>(
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
    description: { type: String, required: true, trim: true, maxlength: 10000 },
    goalAmountCents: { type: Number, required: true, min: 1 },
    raisedAmountCents: { type: Number, required: true, min: 0, default: 0 },
    coverImageUrl: { type: String, trim: true, maxlength: 1000 },
    status: {
      type: String,
      enum: Object.values(CAMPAIGN_STATUSES),
      default: CAMPAIGN_STATUSES.DRAFT,
      index: true,
    },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    sortOrder: { type: Number, default: 0, index: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

campaignSchema.index({ status: 1, sortOrder: 1, createdAt: -1 });

export const Campaign: Model<ICampaign> = model<ICampaign>('Campaign', campaignSchema);
