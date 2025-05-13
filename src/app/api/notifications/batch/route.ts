import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NotificationService } from "@/lib/api/notification-service";
import { ConnectToDatabase } from "@/lib/mongoose";
import { User } from "@/models/user";

// Type for batch notification request
interface BatchNotificationRequest {
  userIds: string[];
  title: string;
  message: string;
  type: 'application' | 'job' | 'message' | 'system' | 'contract' | 'payment';
  relatedId?: string;
}

// POST handler - Create notifications for multiple users
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Connect to DB to check role
    await ConnectToDatabase();
    
    // Find the user in the database using the email from session
    const userEmail = session.user.email;
    
    const user = await User.findOne({ email: userEmail });
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Only admins can create bulk notifications" },
        { status: 403 }
      );
    }
    
    // Parse the request body
    const data = await request.json() as BatchNotificationRequest;
    const { userIds, title, message, type, relatedId } = data;
    
    // Simple validation
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0 || !title || !message || !type) {
      return NextResponse.json(
        { error: "Missing or invalid required fields: userIds, title, message, or type" },
        { status: 400 }
      );
    }
    
    // Create notifications
    const notifications = await NotificationService.createNotificationForMultipleUsers({
      userIds,
      title,
      message,
      type,
      relatedId
    });
    
    return NextResponse.json({
      success: true,
      message: `${userIds.length} notifications created successfully`,
      count: userIds.length
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error creating batch notifications:", error);
    return NextResponse.json(
      { error: "Failed to create batch notifications" },
      { status: 500 }
    );
  }
}
