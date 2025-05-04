import { NextRequest, NextResponse } from "next/server";
import { ConnectToDatabase } from "@/lib/mongoose";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await ConnectToDatabase();

    // Get user session for authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    
    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    // Only allow users to fetch their own data
    if (email !== session.user.email) {
      return NextResponse.json(
        { error: "Unauthorized to access this user data" },
        { status: 403 }
      );
    }

    // Get the User model
    const User = mongoose.models.User;
    const user = await User.findOne({ email }).select("-password");
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: user,
    });
    
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}