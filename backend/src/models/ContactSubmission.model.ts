import { Schema, model, type Document, type Model } from 'mongoose';
import {
  CONTACT_SUBMISSION_STATUSES,
  type ContactSubmissionStatus,
} from '../constants/contact.js';

export interface IContactSubmission extends Document {
  name: string;
  email: string;
  phone: string;
  company?: string;
  message: string;
  status: ContactSubmissionStatus;
  createdAt: Date;
  updatedAt: Date;
}

const contactSubmissionSchema = new Schema<IContactSubmission>(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 320 },
    phone: { type: String, required: true, trim: true, maxlength: 50 },
    company: { type: String, trim: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    status: {
      type: String,
      enum: Object.values(CONTACT_SUBMISSION_STATUSES),
      default: CONTACT_SUBMISSION_STATUSES.NEW,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

contactSubmissionSchema.index({ createdAt: -1 });
contactSubmissionSchema.index({ email: 1 });

export const ContactSubmission: Model<IContactSubmission> = model<IContactSubmission>(
  'ContactSubmission',
  contactSubmissionSchema,
);
