import { NextRequest, NextResponse } from "next/server";
import { ConnectToDatabase } from "@/lib/mongoose";
import { WorkerProfile } from "@/models/freelance-collab";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

// GET /api/collaboration - Get all collaborations for the current user
export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await ConnectToDatabase();
    
    // Get the current user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get user ID from the session email
    const User = mongoose.models.User;
    const dbUser = await User.findOne({ email: session.user.email });
    
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    const userId = dbUser._id;

    // Check if countOnly parameter is present (for profile count limit checking)
    const url = new URL(request.url);
    const countOnly = url.searchParams.get("countOnly") === "true";
    
    if (countOnly) {
      const count = await WorkerProfile.countDocuments({ userId });
      return NextResponse.json({ count });
    }

    // Find all worker profiles for this user
    const collaborations = await WorkerProfile.find({ userId });
    
    return NextResponse.json(collaborations);
  } catch (error) {
    console.error("Error fetching collaborations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/collaboration - Create a new collaboration profile
export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await ConnectToDatabase();
    
    // Get the current user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user ID from the session email
    const User = mongoose.models.User;
    const dbUser = await User.findOne({ email: session.user.email });
    
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    const userId = dbUser._id;
    
    // Parse request body
    const body = await request.json();
    
    // Create a new worker profile
    const collaboration = await WorkerProfile.create({
      ...body,
      userId // Associate with the database user ID
    });
    
    return NextResponse.json(collaboration, { status: 201 });
  } catch (error: any) {
    console.error("Error creating collaboration:", error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors: Record<string, string> = {};
      
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      
      return NextResponse.json(
        { error: "Validation Error", details: validationErrors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}