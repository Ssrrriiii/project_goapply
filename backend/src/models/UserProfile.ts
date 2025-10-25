import mongoose, { Document, Schema } from 'mongoose';

export interface IUserProfile extends Document {
  userId: mongoose.Types.ObjectId;
  phone?: string;
  dateOfBirth?: Date;
  nationality?: string;
  address?: string;
  bio?: string;
  
  // Questionnaire data
  fieldOfStudy?: string;
  studyLevel?: string;
  englishTest?: string;
  englishScore?: string;
  availableFunds?: number;
  visaRefusal?: boolean;
  studyStartDate?: Date;
  educationLevel?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const userProfileSchema = new Schema<IUserProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    phone: String,
    dateOfBirth: Date,
    nationality: String,
    address: String,
    bio: String,
    
    // Questionnaire
    fieldOfStudy: String,
    studyLevel: String,
    englishTest: String,
    englishScore: String,
    availableFunds: Number,
    visaRefusal: {
      type: Boolean,
      default: false,
    },
    studyStartDate: Date,
    educationLevel: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUserProfile>('UserProfile', userProfileSchema);