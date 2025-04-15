import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { ConnectToDatabase } from "@/lib/mongoose";
import mongoose from "mongoose";

// Define interfaces for our document types
interface IFreelanceGig {
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
  thumbnail?: string;
  video?: string;
  documents: string[];
  buyerRequirements?: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'pending' | 'inactive';
}

interface IUser {
  email: string;
  _id: mongoose.Types.ObjectId;
}

// Define the schema for freelance gigs
const freelanceGigSchema = new mongoose.Schema({
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
  
  // Gig Details
  gigTitle: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  gigDescription: { type: String, required: true },
  searchTags: { type: String, required: true },
  deliveryTime: { type: String, required: true },
  revisions: { type: String, required: true },
  
  // Pricing
  pricingModel: { 
    type: String, 
    enum: ["single", "tiered"], 
    required: true 
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
  thumbnail: String,         // URL to the thumbnail image
  video: String,             // URL to the video
  documents: [String],       // URLs to the documents
  buyerRequirements: String,
  
  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ["active", "pending", "inactive"], 
    default: "active" 
  }
});

// Get or create the model
let FreelanceGig: mongoose.Model<IFreelanceGig>;
try {
  // Try to get the existing model
  FreelanceGig = mongoose.model<IFreelanceGig>("FreelanceGig");
} catch {
  // Create a new model if it doesn't exist
  FreelanceGig = mongoose.model<IFreelanceGig>("FreelanceGig", freelanceGigSchema);
}

// Get or create the User model
let User: mongoose.Model<IUser>;
try {
  User = mongoose.model<IUser>("User");
} catch {
  // Define a minimal User schema if not already defined
  const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }
  });
  User = mongoose.model<IUser>("User", userSchema);
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Connect to the database
    await ConnectToDatabase();
    
    // Parse the request body
    const data = await request.json();
    
    // Find the user in the database using the email from session
    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not found in session" },
        { status: 400 }
      );
    }
    
    const dbUser = await User.findOne({ email: userEmail });
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }
    
    // Create the gig document using the user's database _id
    const newGig = new FreelanceGig({
      ...data,
      userId: dbUser._id, // Use the MongoDB _id of the user
      updatedAt: new Date()
    });
    
    // Save to database
    await newGig.save();
    
    return NextResponse.json({ 
      success: true, 
      message: "Freelance gig created successfully", 
      gigId: newGig._id 
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error creating freelance gig:", error);
    return NextResponse.json(
      { error: "Failed to create gig" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Connect to the database
    await ConnectToDatabase();
    
    // Get URL parameters
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    
    let query = {};
    
    // If userId is provided, filter by that user
    if (userId) {
      query = { userId: new mongoose.Types.ObjectId(userId) };
    }
    
    // Get gigs with pagination
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    
    const gigs = await FreelanceGig
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await FreelanceGig.countDocuments(query);
    
    return NextResponse.json({
      gigs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error fetching freelance gigs:", error);
    return NextResponse.json(
      { error: "Failed to fetch gigs" },
      { status: 500 }
    );
  }
}
