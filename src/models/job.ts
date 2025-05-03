import mongoose, { Schema, Document } from 'mongoose';

// Define the job interface with TypeScript
export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
  industry: string;
  employerId: mongoose.Types.ObjectId;
  applicationDeadline: Date;
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  skills: string[];
  applicantCount: number;
  status: 'active' | 'closed' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema with validation and options
const JobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    requirements: {
      type: String,
      required: [true, 'Job requirements are required'],
    },
    salary: {
      min: {
        type: Number,
      },
      max: {
        type: Number,
      },
      currency: {
        type: String,
        default: 'USD',
      },
    },
    jobType: {
      type: String,
      required: [true, 'Job type is required'],
      enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
    },
    industry: {
      type: String,
      required: [true, 'Industry is required'],
    },
    employerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    applicationDeadline: {
      type: Date,
      required: [true, 'Application deadline is required'],
    },
    experienceLevel: {
      type: String,
      required: [true, 'Experience level is required'],
      enum: ['entry', 'mid', 'senior', 'executive'],
    },
    skills: [{
      type: String,
    }],
    applicantCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'draft'],
      default: 'active',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Prevent model recompilation when the file is imported multiple times
export const Job = mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);