import { NextRequest, NextResponse } from "next/server";
import { ConnectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { WorkerProfile } from "@/models/freelance-collab";
import { HiredCollaboration } from "@/models/hired-collab";
import mongoose from "mongoose";

// POST /api/collaboration/hire - Hire a collaborator (create a HiredCollaboration)
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
    
    const clientId = dbUser._id;
    
    // Parse request body
    const body = await request.json();
    const { profileId, projectTitle, projectDescription, paymentTerms, paymentAmount } = body;
    
    if (!profileId || !mongoose.Types.ObjectId.isValid(profileId)) {
      return NextResponse.json(
        { error: "Invalid worker profile ID" },
        { status: 400 }
      );
    }
    
    // Find the worker profile
    const workerProfile = await WorkerProfile.findById(profileId);
    
    if (!workerProfile) {
      return NextResponse.json(
        { error: "Worker profile not found" },
        { status: 404 }
      );
    }
    
    // Check if user is trying to hire themselves
    if (workerProfile.userId.toString() === clientId.toString()) {
      return NextResponse.json(
        { error: "You cannot hire yourself" },
        { status: 400 }
      );
    }
    
    // Check if this worker is already hired by this client
    const existingHire = await HiredCollaboration.findOne({
      clientId,
      originalProfileId: profileId,
      currentStatus: { $in: ['active', 'on-hold'] }
    });
    
    if (existingHire) {
      return NextResponse.json(
        { error: "You have already hired this collaborator" },
        { status: 400 }
      );
    }
    
    // Create hired collaboration by copying worker profile and adding hire-specific fields
    const profileData = workerProfile.toObject();
    
    // Remove MongoDB specific fields
    delete profileData._id;
    delete profileData.__v;
    
    // Create new hired collaboration
    const hiredCollaboration = await HiredCollaboration.create({
      ...profileData,
      clientId,
      originalProfileId: profileId,
      hiredDate: new Date(),
      projectTitle: projectTitle || `Project with ${workerProfile.name}`,
      projectDescription: projectDescription || `Collaboration with ${workerProfile.name}`,
      paymentTerms: paymentTerms || "To be discussed",
      paymentAmount: paymentAmount,
      currentStatus: 'active'
    });
    
    return NextResponse.json(hiredCollaboration, { status: 201 });
    
  } catch (error) {
    console.error("Error hiring collaborator:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}