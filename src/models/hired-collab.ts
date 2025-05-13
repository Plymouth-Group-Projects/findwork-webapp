import mongoose, { Schema, Document } from 'mongoose';
import { IWorkerProfile } from './freelance-collab';

// Define the HiredCollaboration interface extending the WorkerProfile
export interface IHiredCollaboration extends Omit<IWorkerProfile, '_id'> {
  clientId: mongoose.Types.ObjectId; // The user who hired this collaborator
  originalProfileId: mongoose.Types.ObjectId; // Reference to the original worker profile
  hiredDate: Date;
  contractEndDate?: Date;
  projectTitle: string;
  projectDescription: string;
  paymentTerms: string;
  paymentAmount?: number;
  currentStatus: 'active' | 'completed' | 'terminated' | 'on-hold';
  stripeSessionId?: string; // Reference to the Stripe payment session
  feedback?: {
    rating: number;
    comment: string;
    date: Date;
  };
}

// Create the schema with validation and options
const HiredCollaborationSchema = new Schema<IHiredCollaboration>(
  {
    // User relationship - original worker's ID
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    
    // Client relationship - who hired this worker
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    
    // Reference to original profile
    originalProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "WorkerProfile"
    },
    
    // Hire details
    hiredDate: { type: Date, default: Date.now },
    contractEndDate: { type: Date },
    projectTitle: { type: String, required: true },
    projectDescription: { type: String, required: true },
    paymentTerms: { type: String, required: true },
    paymentAmount: { type: Number },
    currentStatus: { 
      type: String, 
      enum: ['active', 'completed', 'terminated', 'on-hold'],
      default: 'active',
      required: true
    },
    
    // Feedback after project completion
    feedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String },
      date: { type: Date }
    },
    
    // Personal Information (copied from worker profile)
    name: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: String, required: true },
    profileTitle: { type: String, required: true },
    
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
          employer: { type: String },
          duration: { type: String },
          role: { type: String },
        }],
        default: []
      },
    },
    
    // Education Details
    education: {
      type: [{
        institution: { type: String },
        qualification: { type: String },
        yearCompleted: { type: Number },
      }],
      default: []
    },
    
    // Certifications
    certifications: {
      type: [{
        title: { type: String },
        issuer: { type: String },
        year: { type: Number },
      }],
      default: []
    },
    
    // Media Requirements
    portfolioImages: { type: [String], required: true },
    thumbnail: { type: String, required: true },
    video: { type: String },
    documents: { type: [String] },
    buyerRequirements: { type: String },
      // Status from the original model
    status: { 
      type: String, 
      enum: ["active", "pending", "inactive"], 
      default: "active" 
    },
      // Payment reference
    stripeSessionId: {
      type: String
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
HiredCollaborationSchema.index({ clientId: 1 });
HiredCollaborationSchema.index({ userId: 1 });
HiredCollaborationSchema.index({ originalProfileId: 1 });
HiredCollaborationSchema.index({ currentStatus: 1 });
HiredCollaborationSchema.index({ 
  projectTitle: 'text', 
  projectDescription: 'text', 
  name: 'text',
  topSkills: 'text'
});

// Prevent model recompilation when the file is imported multiple times
export const HiredCollaboration = mongoose.models.HiredCollaboration || 
  mongoose.model<IHiredCollaboration>('HiredCollaboration', HiredCollaborationSchema);