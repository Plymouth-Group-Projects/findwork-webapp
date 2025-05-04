import mongoose, { Schema, Document } from 'mongoose';

// Define the WorkerProfile interface with TypeScript
export interface IWorkerProfile extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  gender: string;
  dob: string;
  profileTitle: string; // Title to identify different profiles from the same user
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  languagesSpoken: string[];
  bio: string;
  category: string;
  topSkills: string[];
  level: string;
  availability: string;
  salary: string;
  jobsCompleted: number;
  experience: {
    years: number;
    previousEmployers: Array<{
      employer?: string;
      duration?: string;
      role?: string;
    }>;
  };
  education: Array<{
    institution?: string;
    qualification?: string;
    yearCompleted?: number;
  }>;
  certifications: Array<{
    title?: string;
    issuer?: string;
    year?: number;
  }>;
  // Media requirements
  portfolioImages: string[];
  thumbnail: string;
  video?: string;
  documents?: string[];
  buyerRequirements?: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'pending' | 'inactive';
}

// Create the schema with validation and options
const WorkerProfileSchema = new Schema<IWorkerProfile>(
  {
    // User relationship
    userId: {
      type: mongoose.Schema.Types.ObjectId, 
      required: true,
      ref: "User"
    },
    
    // Personal Information
    name: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: String, required: true },
    profileTitle: { type: String, required: true }, // Title to identify different profiles
    
    // Contact Information
    contact: {
      phone: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
    },
    
    // Professional Information
    languagesSpoken: { type: [String], required: true },
    bio: { type: String, required: true },
    category: { type: String, required: true },
    topSkills: { type: [String], required: true },
    level: { type: String, required: true },
    availability: { type: String, required: true },
    salary: { type: String, required: true },
    jobsCompleted: { type: Number, default: 0 },
    
    // Experience Details
    experience: {
      years: { type: Number, default: 0 },
      previousEmployers: {
        type: [{
          employer: { type: String, required: false },
          duration: { type: String, required: false },
          role: { type: String, required: false },
        }],
        required: false,
        default: []
      },
    },
    
    // Education Details
    education: {
      type: [{
        institution: { type: String, required: false },
        qualification: { type: String, required: false },
        yearCompleted: { type: Number, required: false },
      }],
      required: false,
      default: []
    },
    
    // Certifications
    certifications: {
      type: [{
        title: { type: String, required: false },
        issuer: { type: String, required: false },
        year: { type: Number, required: false },
      }],
      required: false,
      default: []
    },
    
    // Media Requirements
    portfolioImages: { type: [String], required: true }, // URLs to portfolio images
    thumbnail: { type: String, required: true }, // Main profile/service thumbnail
    video: { type: String }, // Optional video introduction
    documents: { type: [String] }, // Optional PDF documents like certifications
    buyerRequirements: { type: String }, // Information needed from potential clients
    
    // Metadata
    status: { 
      type: String, 
      enum: ["active", "pending", "inactive"], 
      default: "active" 
    }
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

// Create indexes for efficient querying
WorkerProfileSchema.index({ userId: 1 });
WorkerProfileSchema.index({ category: 1 });
WorkerProfileSchema.index({ topSkills: 1 });
WorkerProfileSchema.index({ status: 1 });
WorkerProfileSchema.index({ 
  name: 'text', 
  bio: 'text', 
  profileTitle: 'text',
  'topSkills': 'text', 
  category: 'text' 
});

// Prevent model recompilation when the file is imported multiple times
export const WorkerProfile = mongoose.models.WorkerProfile || mongoose.model<IWorkerProfile>('WorkerProfile', WorkerProfileSchema);