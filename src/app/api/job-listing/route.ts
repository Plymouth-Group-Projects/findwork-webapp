import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ConnectToDatabase } from "@/lib/mongoose";
import mongoose, { Model } from "mongoose";
import { Job } from "@/models/job";
import { IUser, User as UserModel } from "@/models/user";

// Define interface for job query filters
interface JobQuery {
  employerId?: mongoose.Types.ObjectId;
  status?: string;
  _id?: string;
  $or?: Array<{
    [key: string]: {
      $regex: string;
      $options: string;
    };
  }>;
}

// Define interface for user document from DB
interface UserDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  name?: string;
  role?: string;
  [key: string]: any;
}

// GET handler - Fetch all jobs for the current user or filter by query params
export async function GET(request: NextRequest) {
  try {
    // Authenticate the user
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Connect to the database
    await ConnectToDatabase();

    // Parse query parameters
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const status = url.searchParams.get("status");
    const search = url.searchParams.get("search");
    const id = url.searchParams.get("id");
    
    // Find the user in the database using the email from session
    const dbUser = await UserModel.findOne({ email: session.user.email }) as UserDocument;
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }
    
    // Build query
    let query: JobQuery = { employerId: dbUser._id };
    
    // Filter by status if provided
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Filter by search term if provided
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }
    
    // If specific job ID is requested
    if (id) {
      query = { _id: id };
    }
    
    // Calculate skip for pagination
    const skip = (page - 1) * limit;
    
    // Fetch jobs with pagination
    const jobs = await Job
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await Job.countDocuments(query);
    
    return NextResponse.json({
      jobs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error fetching job listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch job listings" },
      { status: 500 }
    );
  }
}

// POST handler - Create a new job listing
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Connect to the database
    await ConnectToDatabase();
    
    // Parse the request body
    const data = await request.json();
    
    // Find the user in the database using the email from session
    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not found in session" },
        { status: 400 }
      );
    }
    
    const dbUser = await UserModel.findOne({ email: userEmail }) as UserDocument;
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }
    
    // Use the MongoDB ObjectId from the database
    const userId = dbUser._id;
    
    // Validate required fields
    const requiredFields = [
      'title', 'company', 'location', 'description', 
      'requirements', 'jobType', 'industry', 
      'experienceLevel'
    ];
    
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: `Missing required fields: ${missingFields.join(', ')}`,
          missingFields 
        },
        { status: 400 }
      );
    }
    
    // Create job document
    const newJob = new Job({
      ...data,
      employerId: userId,
      applicationDeadline: data.deadline ? new Date(data.deadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days
      status: data.status || 'active',
      applicantCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Save to database
    await newJob.save();
    
    return NextResponse.json({ 
      success: true, 
      message: "Job listing created successfully", 
      jobId: newJob._id 
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error creating job listing:", error);
    
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to create job listing", details: errorMessage },
      { status: 500 }
    );
  }
}

// PATCH handler - Update an existing job listing
export async function PATCH(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Connect to the database
    await ConnectToDatabase();
    
    // Parse the request body
    const data = await request.json();
    
    if (!data._id) {
      return NextResponse.json(
        { error: "Job ID is required for updates" },
        { status: 400 }
      );
    }
    
    // Find the user in the database using the email from session
    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not found in session" },
        { status: 400 }
      );
    }
    
    const dbUser = await UserModel.findOne({ email: userEmail }) as UserDocument;
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }
    
    // Check if the job exists and belongs to this user
    const job = await Job.findById(data._id);
    
    if (!job) {
      return NextResponse.json(
        { error: "Job listing not found" },
        { status: 404 }
      );
    }
    
    if (job.employerId.toString() !== dbUser._id.toString()) {
      return NextResponse.json(
        { error: "You do not have permission to update this job listing" },
        { status: 403 }
      );
    }
    
    // Prepare update data (omit _id and other non-updatable fields)
    const updateData = { ...data };
    delete updateData._id;
    delete updateData.employerId;
    delete updateData.createdAt;
    delete updateData.applicantCount;
    
    // Handle deadline conversion if provided
    if (updateData.deadline) {
      updateData.applicationDeadline = new Date(updateData.deadline);
      delete updateData.deadline;
    }
    
    // Update the job
    const updatedJob = await Job.findByIdAndUpdate(
      data._id,
      { 
        ...updateData,
        updatedAt: new Date() 
      },
      { new: true }
    );
    
    return NextResponse.json({ 
      success: true, 
      message: "Job listing updated successfully", 
      job: updatedJob 
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error updating job listing:", error);
    
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to update job listing", details: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE handler - Delete a job listing
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Connect to the database
    await ConnectToDatabase();
    
    // Parse URL to get job ID
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }
    
    // Find the user in the database
    const dbUser = await UserModel.findOne({ email: session.user.email }) as UserDocument;
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }
    
    // Check if the job exists and belongs to this user
    const job = await Job.findById(id);
    
    if (!job) {
      return NextResponse.json(
        { error: "Job listing not found" },
        { status: 404 }
      );
    }
    
    if (job.employerId.toString() !== dbUser._id.toString()) {
      return NextResponse.json(
        { error: "You do not have permission to delete this job listing" },
        { status: 403 }
      );
    }
    
    // Delete the job
    await Job.findByIdAndDelete(id);
    
    return NextResponse.json({ 
      success: true, 
      message: "Job listing deleted successfully" 
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error deleting job listing:", error);
    
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to delete job listing", details: errorMessage },
      { status: 500 }
    );
  }
}