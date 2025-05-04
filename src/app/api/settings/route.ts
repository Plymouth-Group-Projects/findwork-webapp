"use server"

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ConnectToDatabase } from "@/lib/mongoose";
import { User, IUser, UserSettings } from "@/models/user";
import mongoose from "mongoose";

// Default settings to provide when a user doesn't have settings yet
const defaultSettings: UserSettings = {
  accountSettings: {
    emailNotifications: true,
    marketingEmails: false,
    socialConnections: true,
    twoFactorAuth: false,
  },
  appearanceSettings: {
    theme: "system",
    compactView: false,
    fontSize: "md",
    animationsEnabled: true,
  },
  privacySettings: {
    profileVisibility: "public",
    showActivity: true,
    showOnlineStatus: true,
  },
};

// Define a type for the lean document returned by mongoose
type LeanUser = {
  _id: mongoose.Types.ObjectId;
  email: string;
  name?: string;
  settings?: UserSettings;
  [key: string]: any;
};

// GET handler - Fetch the current user's settings
export async function GET(request: NextRequest) {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions);

    // Check authentication
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Connect to the database
    await ConnectToDatabase();
    
    // Find the user in the database using the email from session
    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not found in session" },
        { status: 400 }
      );
    }
    
    // Get the user from the database
    const user = await User.findOne({ email: userEmail }).lean() as unknown as LeanUser;
      
    if (!user) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    // If user has settings, return them; otherwise return default settings
    if (user.settings) {
      return NextResponse.json(user.settings);
    } else {
      // Return default settings if user doesn't have any saved
      return NextResponse.json(defaultSettings);
    }
    
  } catch (error: any) {
    console.error('Error fetching user settings:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT handler - Update the current user's settings
export async function PUT(request: NextRequest) {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions);

    // Check authentication
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Connect to the database
    await ConnectToDatabase();
    
    // Parse the request body
    const settingsData = await request.json() as UserSettings;
    
    // Find the user in the database using the email from session
    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not found in session" },
        { status: 400 }
      );
    }

    // Find and update the user with the new settings
    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      { $set: { settings: settingsData } },
      { new: true, runValidators: true }
    ).lean() as unknown as LeanUser;
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // Return the updated settings
    return NextResponse.json(updatedUser.settings || defaultSettings);
    
  } catch (error: any) {
    console.error('Error updating user settings:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}