import { Schema, model, type Document, type Model, type Types } from 'mongoose';
import { DEFAULT_DONATION_CURRENCY, DONATION_STATUSES, type DonationStatus } from '../constants/donation.js';

export interface IDonation extends Document {
  donorName: string;
  email: string;
  phone?: string;
  country?: string;
  amountCents: number;
  currency: string;
  campaignId?: Types.ObjectId;
  status: DonationStatus;
  stripeCheckoutSessionId?: string;
  stripePaymentIntentId?: string;
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const donationSchema = new Schema<IDonation>(
  {
    donorName: { type: String, required: true, trim: true, maxlength: 200 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 320 },
    phone: { type: String, trim: true, maxlength: 50 },
    country: { type: String, trim: true, maxlength: 100 },
    amountCents: { type: Number, required: true, min: 1 },
    currency: { type: String, required: true, trim: true, lowercase: true, default: DEFAULT_DONATION_CURRENCY },
    campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign', index: true },
    status: {
      type: String,
      enum: Object.values(DONATION_STATUSES),
      default: DONATION_STATUSES.PENDING,
      index: true,
    },
    stripeCheckoutSessionId: { type: String, trim: true, sparse: true },
    stripePaymentIntentId: { type: String, trim: true, sparse: true },
    transactionId: { type: String, trim: true, sparse: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

donationSchema.index({ createdAt: -1 });
donationSchema.index({ email: 1 });

export const Donation: Model<IDonation> = model<IDonation>('Donation', donationSchema);
