import mongoose, { Document, Schema } from 'mongoose';

export interface IDocument extends Document {
  userId: mongoose.Types.ObjectId;
  applicationId?: mongoose.Types.ObjectId;
  type: string;
  url: string;
  filename: string;
  uploadedAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: 'Application',
    },
    type: {
      type: String,
      required: true,
      enum: ['transcript', 'essay', 'recommendation', 'resume', 'other'],
    },
    url: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  }
);

export default mongoose.model<IDocument>('Document', documentSchema);