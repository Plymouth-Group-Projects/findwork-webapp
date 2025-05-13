import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NotificationService } from "@/lib/api/notification-service";
import { ConnectToDatabase } from "@/lib/mongoose";
import { User } from "@/models/user";

// POST handler - Create notification for a user
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
        { error: "Forbidden - Only admins can create notifications for other users" },
        { status: 403 }
      );
    }
    
    // Parse the request body
    const data = await request.json();
    const { userId, title, message, type, relatedId } = data;
    
    // Simple validation
    if (!userId || !title || !message || !type) {
      return NextResponse.json(
        { error: "Missing required fields: userId, title, message, or type" },
        { status: 400 }
      );
    }
    
    // Create notification
    const notification = await NotificationService.createNotification({
      userId,
      title,
      message,
      type,
      relatedId
    });
    
    return NextResponse.json({
      success: true,
      message: "Notification created successfully",
      notification
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}

// DELETE handler - Delete a notification (admin only)
export async function DELETE(request: NextRequest) {
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
        { error: "Forbidden - Only admins can delete notifications" },
        { status: 403 }
      );
    }
    
    // Get notification ID from URL
    const url = new URL(request.url);
    const notificationId = url.searchParams.get("id");
    
    if (!notificationId) {
      return NextResponse.json(
        { error: "Missing notification ID" },
        { status: 400 }
      );
    }
    
    // Delete the notification
    await NotificationService.deleteNotification(notificationId);
    
    return NextResponse.json({
      success: true,
      message: "Notification deleted successfully"
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 }
    );
  }
}
