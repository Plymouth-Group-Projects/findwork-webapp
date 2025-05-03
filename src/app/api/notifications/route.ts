"use server"

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ConnectToDatabase } from "@/lib/mongoose";
import mongoose from "mongoose";
import { Notification } from "@/models/notification";

// Type definition for request body when creating a notification
interface CreateNotificationBody {
  title: string;
  message: string;
  type: 'application' | 'job' | 'message' | 'system' | 'contract' | 'payment';
  relatedId?: string;
}

// Type definition for request body when marking notifications as read
interface MarkReadBody {
  notificationIds: string[];
}

// GET handler - Fetch notifications for the current user
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Connect to the database
    await ConnectToDatabase();
    
    // Parse URL parameters for pagination
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    const unreadOnly = url.searchParams.get("unread") === "true";
    
    // Build the query
    const query: any = { userId: new mongoose.Types.ObjectId(session.user.id) };
    if (unreadOnly) {
      query.read = false;
    }
    
    // Fetch notifications with pagination
    const notifications = await Notification
      .find(query)
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await Notification.countDocuments(query);
    
    // Calculate unread count
    const unreadCount = await Notification.countDocuments({ 
      userId: new mongoose.Types.ObjectId(session.user.id),
      read: false
    });
    
    return NextResponse.json({
      notifications,
      pagination: {
        total,
        unreadCount,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// POST handler - Create a notification
export async function POST(request: NextRequest) {
  try {
    // Check authentication - only allow admins or system to create notifications
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Connect to the database
    await ConnectToDatabase();
    
    // Parse the request body
    const data = await request.json() as CreateNotificationBody;
    const { title, message, type, relatedId } = data;
    
    // Simple validation
    if (!title || !message || !type) {
      return NextResponse.json(
        { error: "Missing required fields: title, message, or type" },
        { status: 400 }
      );
    }
    
    // Create the notification
    const notification = new Notification({
      userId: new mongoose.Types.ObjectId(session.user.id),
      title,
      message,
      type,
      read: false,
      ...(relatedId && { relatedId: new mongoose.Types.ObjectId(relatedId) }),
    });
    
    // Save to database
    await notification.save();
    
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

// PATCH handler - Mark notifications as read
export async function PATCH(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Connect to the database
    await ConnectToDatabase();
    
    // Parse the request body
    const data = await request.json() as MarkReadBody;
    const { notificationIds } = data;
    
    if (!notificationIds || !Array.isArray(notificationIds) || notificationIds.length === 0) {
      return NextResponse.json(
        { error: "Invalid notificationIds provided" },
        { status: 400 }
      );
    }
    
    // Convert string IDs to ObjectIDs
    const objectIds = notificationIds.map(id => new mongoose.Types.ObjectId(id));
    
    // Update the notifications
    const result = await Notification.updateMany(
      { 
        _id: { $in: objectIds },
        userId: new mongoose.Types.ObjectId(session.user.id) // Security: ensure user only updates their own notifications
      },
      { $set: { read: true } }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "No matching notifications found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `${result.modifiedCount} notifications marked as read` 
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return NextResponse.json(
      { error: "Failed to mark notifications as read" },
      { status: 500 }
    );
  }
}