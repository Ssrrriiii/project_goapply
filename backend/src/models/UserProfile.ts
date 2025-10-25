import mongoose, { Document, Schema } from 'mongoose';

export interface IUserProfile extends Document {
  userId: mongoose.Types.ObjectId;
  
  // Basic profile info
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  bio?: string;
  
  // Academic info
  fieldOfStudy?: string;
  studyLevel?: 'masters' | 'bachelors' | 'diploma';
  nationality?: string;
  englishProficiency?: {
    hasTestResults: boolean;
    examType?: 'IELTS' | 'TOEFL' | 'PTE' | 'Duolingo' | 'Other';
    examScore?: string;
    proficiencyLevel?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Native';
  };
  availableFunds?: number; // in USD
  visaRefusalHistory?: {
    hasBeenRefused: boolean;
    details?: string;
  };
  intendedStartDate?: Date;
  education?: {
    highestLevel: 'graduated' | 'studying';
    country?: string;
    level?: 'primary' | 'secondary' | 'undergraduate' | 'postgraduate';
    grade?: string; // For primary/secondary
    details?: string; // For undergraduate/postgraduate
  };
  standardizedTests?: Array<'GMAT' | 'GRE' | 'None'>;
  
  // Progress tracking
  currentStep?: number;
  completedSteps?: number[];
  
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
    
    // Basic profile info
    phone: String,
    dateOfBirth: String,
    address: String,
    bio: String,
    
    // Academic info
    fieldOfStudy: String,
    studyLevel: {
      type: String,
      enum: ['masters', 'bachelors', 'diploma'],
    },
    nationality: String,
    englishProficiency: {
      hasTestResults: { type: Boolean, default: false },
      examType: {
        type: String,
        enum: ['IELTS', 'TOEFL', 'PTE', 'Duolingo', 'Other'],
      },
      examScore: String,
      proficiencyLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Native'],
      },
    },
    availableFunds: Number,
    visaRefusalHistory: {
      hasBeenRefused: { type: Boolean, default: false },
      details: String,
    },
    intendedStartDate: Date,
    education: {
      highestLevel: {
        type: String,
        enum: ['graduated', 'studying'],
      },
      country: String,
      level: {
        type: String,
        enum: ['primary', 'secondary', 'undergraduate', 'postgraduate'],
      },
      grade: String,
      details: String,
    },
    standardizedTests: [{
      type: String,
      enum: ['GMAT', 'GRE', 'None'],
    }],
    
    // Progress tracking
    currentStep: { type: Number, default: 1 },
    completedSteps: [Number],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUserProfile>('UserProfile', userProfileSchema);