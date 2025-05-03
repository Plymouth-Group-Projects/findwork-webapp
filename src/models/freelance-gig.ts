import mongoose, { Schema, Document } from 'mongoose';

// Define the FreelanceGig interface with TypeScript
export interface IFreelanceGig extends Document {
  userId: mongoose.Types.ObjectId;
  professionalTitle: string;
  shortBio: string;
  skills: string;
  languages: string;
  experienceLevel: string;
  gigTitle: string;
  category: string;
  subcategory: string;
  gigDescription: string;
  searchTags: string;
  deliveryTime: string;
  revisions: string;
  pricingModel: 'single' | 'tiered';
  singlePrice?: string;
  basicPackage?: {
    name: string;
    description: string;
    price: string;
    deliveryTime: string;
    revisions: string;
    includes: string;
  };
  standardPackage?: {
    name: string;
    description: string;
    price: string;
    deliveryTime: string;
    revisions: string;
    includes: string;
  };
  premiumPackage?: {
    name: string;
    description: string;
    price: string;
    deliveryTime: string;
    revisions: string;
    includes: string;
  };
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
const FreelanceGigSchema = new Schema<IFreelanceGig>(
  {
    // User relationship
    userId: {
      type: mongoose.Schema.Types.ObjectId, 
      required: true,
      ref: "User"
    },
    
    // Professional Information
    professionalTitle: { type: String, required: true },
    shortBio: { type: String, required: true },
    skills: { type: String, required: true },
    languages: { type: String, required: true },
    experienceLevel: { type: String, required: true },
    
    // Gig Information
    gigTitle: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    gigDescription: { type: String, required: true },
    searchTags: String,
    deliveryTime: { type: String, required: true },
    revisions: { type: String, required: true },
    
    // Pricing
    pricingModel: {
      type: String,
      enum: ["single", "tiered"],
      required: true,
    },
    singlePrice: String,
    basicPackage: {
      name: String,
      description: String,
      price: String,
      deliveryTime: String,
      revisions: String,
      includes: String
    },
    standardPackage: {
      name: String,
      description: String,
      price: String,
      deliveryTime: String,
      revisions: String,
      includes: String
    },
    premiumPackage: {
      name: String,
      description: String,
      price: String,
      deliveryTime: String,
      revisions: String,
      includes: String
    },
    
    // Media & Requirements
    portfolioImages: [String], // URLs to the images stored in UploadThing
    thumbnail: { type: String, required: true },
    video: String,
    documents: [String],
    buyerRequirements: String,
    
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
FreelanceGigSchema.index({ userId: 1 });
FreelanceGigSchema.index({ category: 1, subcategory: 1 });
FreelanceGigSchema.index({ status: 1 });
FreelanceGigSchema.index({ skills: 'text', gigTitle: 'text', gigDescription: 'text', searchTags: 'text' });

// Prevent model recompilation when the file is imported multiple times
export const FreelanceGig = mongoose.models.FreelanceGig || mongoose.model<IFreelanceGig>('FreelanceGig', FreelanceGigSchema);