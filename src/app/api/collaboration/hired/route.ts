import { NextRequest, NextResponse } from "next/server";
import { ConnectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";
import { HiredCollaboration } from "@/models/hired-collab";

// GET /api/collaboration/hired - Get all hired collaborations for the current user
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
    
    // Check if countOnly parameter is present (for count display in tabs)
    const url = new URL(request.url);
    const countOnly = url.searchParams.get("countOnly") === "true";
      // If countOnly is true, just return the count
    if (countOnly) {
      const count = await HiredCollaboration.countDocuments({ clientId: userId });
      return NextResponse.json({ count });
    }
    
    // Find hired collaborations where this user is the client
    const hiredCollaborations = await HiredCollaboration.find({ 
      clientId: userId,
      currentStatus: { $in: ['active', 'on-hold', 'completed'] }
    });
    
    return NextResponse.json(hiredCollaborations);
    
  } catch (error) {
    console.error("Error fetching hired collaborations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
