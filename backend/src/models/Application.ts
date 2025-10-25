import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  userId: mongoose.Types.ObjectId;
  universityId: string;
  program: string;
  status: 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected';
  progress: number;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    universityId: {
      type: String,
      required: true,
    },
    program: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'submitted', 'under_review', 'accepted', 'rejected'],
      default: 'draft',
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    submittedAt: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IApplication>('Application', applicationSchema);