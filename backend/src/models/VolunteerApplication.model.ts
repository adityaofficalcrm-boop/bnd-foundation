import { Schema, model, type Document, type Model } from 'mongoose';
import {
  VOLUNTEER_APPLICATION_STATUSES,
  type VolunteerApplicationStatus,
} from '../constants/volunteer.js';

export interface IVolunteerApplication extends Document {
  fullName: string;
  email: string;
  phone: string;
  city?: string;
  country?: string;
  interests: string;
  availability?: string;
  message: string;
  status: VolunteerApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const volunteerApplicationSchema = new Schema<IVolunteerApplication>(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 200 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 320 },
    phone: { type: String, required: true, trim: true, maxlength: 50 },
    city: { type: String, trim: true, maxlength: 120 },
    country: { type: String, trim: true, maxlength: 100 },
    interests: { type: String, required: true, trim: true, maxlength: 500 },
    availability: { type: String, trim: true, maxlength: 500 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    status: {
      type: String,
      enum: Object.values(VOLUNTEER_APPLICATION_STATUSES),
      default: VOLUNTEER_APPLICATION_STATUSES.NEW,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

volunteerApplicationSchema.index({ createdAt: -1 });
volunteerApplicationSchema.index({ email: 1 });

export const VolunteerApplication: Model<IVolunteerApplication> = model<IVolunteerApplication>(
  'VolunteerApplication',
  volunteerApplicationSchema,
);
