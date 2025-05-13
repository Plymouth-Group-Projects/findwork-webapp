import { NextRequest, NextResponse } from "next/server";
import { ConnectToDatabase } from "@/lib/mongoose";
import { WorkerProfile } from "@/models/freelance-collab";
import { HiredCollaboration } from "@/models/hired-collab";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/collaboration/[id] - Get a specific collaboration by ID (could be a WorkerProfile or HiredCollaboration)
export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await ConnectToDatabase();
    
    const id = params.id;
    
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid collaboration ID format" },
        { status: 400 }
      );
    }
    
    // First, check if this is a regular WorkerProfile
    let collaboration = await WorkerProfile.findById(id);
    let isHiredCollaboration = false;
    
    // If not found, check if it's a HiredCollaboration
    if (!collaboration) {
      collaboration = await HiredCollaboration.findById(id);
      isHiredCollaboration = true;
    }
    
    if (!collaboration) {
      return NextResponse.json(
        { error: "Collaboration not found" },
        { status: 404 }
      );
    }    // Get user information for this profile
    const User = mongoose.models.User;
    const user = await User.findById(collaboration.userId).select("firstName lastName email image address");
    
    // Map fields directly matching the database structure
    const profile = collaboration.toObject();
    
    // Return profile data with minimal transformations to match the database structure
    return NextResponse.json({
      ...profile,
      isHiredCollaboration,
      userInfo: user ? {
        name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : (user.firstName || "User"),
        email: user.email,
        profilePicture: user.image,
        address: user.address
      } : null
    });
  } catch (error) {
    console.error("Error fetching collaboration:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT /api/collaboration/[id] - Update a collaboration profile
export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await ConnectToDatabase();
    
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get database user ID from session
    const User = mongoose.models.User;
    const dbUser = await User.findOne({ email: session.user.email });
    
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    const userId = dbUser._id;
    
    // Access params.id from the dynamic route segment
    const id = params?.id;
    
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid collaboration ID format" },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // First, fetch the collaboration to check permission
    const collaboration = await WorkerProfile.findById(id);
    
    if (!collaboration) {
      return NextResponse.json(
        { error: "Collaboration not found" },
        { status: 404 }
      );
    }
    
    // Check if current user owns this collaboration
    if (collaboration.userId.toString() !== userId.toString()) {
      return NextResponse.json(
        { error: "Not authorized to update this collaboration" },
        { status: 403 }
      );
    }
    
    // Update the collaboration
    const updated = await WorkerProfile.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );
    
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Error updating collaboration:", error);
    
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

// DELETE /api/collaboration/[id] - Delete a collaboration profile
export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await ConnectToDatabase();
    
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get database user ID from session
    const User = mongoose.models.User;
    const dbUser = await User.findOne({ email: session.user.email });
    
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    const userId = dbUser._id;
    
    // Access params.id from the dynamic route segment
    const id = params?.id;
    
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid collaboration ID format" },
        { status: 400 }
      );
    }
    
    // First, fetch the collaboration to check permission
    const collaboration = await WorkerProfile.findById(id);
    
    if (!collaboration) {
      return NextResponse.json(
        { error: "Collaboration not found" },
        { status: 404 }
      );
    }
    
    // Check if current user owns this collaboration
    if (collaboration.userId.toString() !== userId.toString()) {
      return NextResponse.json(
        { error: "Not authorized to delete this collaboration" },
        { status: 403 }
      );
    }
    
    // Delete the collaboration
    await WorkerProfile.findByIdAndDelete(id);
    
    return NextResponse.json(
      { message: "Collaboration deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting collaboration:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}