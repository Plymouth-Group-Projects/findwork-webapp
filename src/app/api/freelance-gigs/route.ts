import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { ConnectToDatabase } from "@/lib/mongoose";
import mongoose from "mongoose";
import { FreelanceGig, IFreelanceGig } from "@/models/freelance-gig";

// Only need to define User interface as we're keeping that model logic here
interface IUser {
  email: string;
  _id: mongoose.Types.ObjectId;
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
    
    // Always find the user by email to get the MongoDB ObjectId
    const dbUser = await User.findOne({ email: userEmail });
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }
    
    // Always use the MongoDB ObjectId from the database
    const userId = dbUser._id;
    
    // Remove any userId from the incoming data to prevent conflicts
    if (data.userId) {
      delete data.userId;
    }
    
    // Validate required fields
    const requiredFields = [
      'professionalTitle', 'shortBio', 'skills', 'languages', 'experienceLevel',
      'gigTitle', 'category', 'subcategory', 'gigDescription', 'deliveryTime', 'revisions',
      'pricingModel', 'thumbnail'
    ];
    
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: `Missing required fields: ${missingFields.join(', ')}`,
          missingFields 
        },
        { status: 400 }
      );
    }
    
    // Additional pricing model validation
    if (data.pricingModel === 'single' && !data.singlePrice) {
      return NextResponse.json(
        { error: "Single price is required for single pricing model" },
        { status: 400 }
      );
    }
    
    if (data.pricingModel === 'tiered') {
      // Check if at least basic package is defined
      if (!data.basicPackage || !data.basicPackage.price) {
        return NextResponse.json(
          { error: "Basic package with price is required for tiered pricing model" },
          { status: 400 }
        );
      }
    }
    
    // Create the gig document using the user's database _id
    const newGig = new FreelanceGig({
      ...data,
      userId: userId,
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
    
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to create gig", details: errorMessage },
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
