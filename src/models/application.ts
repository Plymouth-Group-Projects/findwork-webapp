import mongoose, { Schema, Document } from 'mongoose';

// Define the application interface with TypeScript
export interface IApplication extends Document {
  jobId: mongoose.Types.ObjectId;
  applicantId: mongoose.Types.ObjectId;
  resume: string; // URL to resume file
  coverLetter: string;
  status: 'pending' | 'reviewed' | 'interview' | 'offered' | 'rejected' | 'accepted' | 'withdrawn';
  notes: string;
  interviewDate?: Date;
  appliedAt: Date;
  updatedAt: Date;
}

// Create the schema with validation and options
const ApplicationSchema = new Schema<IApplication>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    applicantId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resume: {
      type: String, // URL to resume file
      required: [true, 'Resume is required'],
    },
    coverLetter: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'interview', 'offered', 'rejected', 'accepted', 'withdrawn'],
      default: 'pending',
    },
    notes: {
      type: String,
    },
    interviewDate: {
      type: Date,
    },
  },
  {
    timestamps: { 
      createdAt: 'appliedAt', 
      updatedAt: 'updatedAt' 
    },
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Create compound index to ensure a user can only apply once to a job
ApplicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true });

// Prevent model recompilation when the file is imported multiple times
export const Application = mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);