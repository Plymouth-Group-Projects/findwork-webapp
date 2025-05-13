import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NotificationService } from "@/lib/api/notification-service";
import { ConnectToDatabase } from "@/lib/mongoose";
import { User } from "@/models/user";

// GET handler - Get unread notifications count
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Connect to the database
    await ConnectToDatabase();
    
    // Find the user in the database using the email from session
    const userEmail = session.user.email;
    
    const dbUser = await User.findOne({ email: userEmail });
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }
    
    // Use the MongoDB ObjectId from the database
    const userObjectId = dbUser._id;
    
    const count = await NotificationService.getUnreadCount(userObjectId.toString());
    
    return NextResponse.json({
      count
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error fetching unread notification count:", error);
    return NextResponse.json(
      { error: "Failed to fetch unread notification count" },
      { status: 500 }
    );
  }
}
