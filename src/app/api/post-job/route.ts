import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ConnectToDatabase } from "@/lib/mongoose";
import mongoose from "mongoose";
import { Job, IJob } from "@/models/job";
import { User } from "@/models/user";

// POST handler - Create a new job or update an existing one
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
    
    const dbUser = await User.findOne({ email: userEmail });
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }
    
    // Use the MongoDB ObjectId from the database
    const userId = dbUser._id;
    
    // Check if we're updating an existing job
    if (data._id) {
      // Updating existing job
      const jobId = data._id;
      
      // Verify the job exists and belongs to this user
      const existingJob = await Job.findById(jobId);
      
      if (!existingJob) {
        return NextResponse.json(
          { error: "Job not found" },
          { status: 404 }
        );
      }
      
      if (existingJob.employerId.toString() !== userId.toString()) {
        return NextResponse.json(
          { error: "You don't have permission to update this job" },
          { status: 403 }
        );
      }
      
      // Prepare update data with properly typed object
      const updateData: Partial<IJob> = {
        title: data.title,
        company: data.company,
        location: data.location,
        description: data.description,
        requirements: data.requirements,
        salary: {
          min: data.salary?.min || null,
          max: data.salary?.max || null,
          currency: data.salary?.currency || 'LKR',
        },
        jobType: data.jobType,
        industry: data.industry || data.category,
        applicationDeadline: data.deadline ? new Date(data.deadline) : existingJob.applicationDeadline,
        experienceLevel: data.experienceLevel,
        status: data.status || existingJob.status,
        updatedAt: new Date(),
      };
      
      // Add optional fields if provided
      if (data.responsibilities) updateData.responsibilities = data.responsibilities;
      if (data.benefits) updateData.benefits = data.benefits;
      if (data.skills) updateData.skills = data.skills;
      if (data.applicationEmail) updateData.applicationEmail = data.applicationEmail;
      if (data.applicationUrl) updateData.applicationUrl = data.applicationUrl;
      if (data.contactPhone) updateData.contactPhone = data.contactPhone;
      if (data.remoteOption) updateData.remoteOption = data.remoteOption;
      if (data.applicationMethod) updateData.applicationMethod = data.applicationMethod;
      
      // Update the job
      const updatedJob = await Job.findByIdAndUpdate(
        jobId,
        { $set: updateData },
        { new: true, runValidators: true }
      );
      
      return NextResponse.json({
        success: true,
        message: "Job listing updated successfully",
        job: updatedJob
      }, { status: 200 });
      
    } else {
      // Creating new job
      
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
      
      // Create job document with properly typed object
      const jobData: Partial<IJob> = {
        title: data.title,
        company: data.company,
        location: data.location,
        description: data.description,
        requirements: data.requirements,
        salary: {
          min: data.salary?.min || null,
          max: data.salary?.max || null,
          currency: data.salary?.currency || 'LKR',
        },
        jobType: data.jobType,
        industry: data.industry || data.category,
        employerId: userId,
        applicationDeadline: data.deadline ? new Date(data.deadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days
        experienceLevel: data.experienceLevel,
        applicantCount: 0,
        status: data.status || 'active',
      };
      
      // Add optional fields if provided
      if (data.responsibilities) jobData.responsibilities = data.responsibilities;
      if (data.benefits) jobData.benefits = data.benefits;
      if (data.skills) jobData.skills = Array.isArray(data.skills) ? data.skills : [data.skills];
      if (data.applicationEmail) jobData.applicationEmail = data.applicationEmail;
      if (data.applicationUrl) jobData.applicationUrl = data.applicationUrl;
      if (data.contactPhone) jobData.contactPhone = data.contactPhone;
      if (data.remoteOption) jobData.remoteOption = data.remoteOption;
      if (data.applicationMethod) jobData.applicationMethod = data.applicationMethod;
      
      // Save to database
      const newJob = new Job(jobData);
      await newJob.save();
      
      return NextResponse.json({ 
        success: true, 
        message: "Job listing created successfully", 
        jobId: newJob._id 
      }, { status: 201 });
    }
    
  } catch (error) {
    console.error("Error processing job listing:", error);
    
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to process job listing", details: errorMessage },
      { status: 500 }
    );
  }
}

// GET handler - Fetch a specific job by ID or all jobs for the current user
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
    const jobId = url.searchParams.get("id");
    
    // Find the user in the database using the email from session
    const dbUser = await User.findOne({ email: session.user.email });
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }
    
    // If a specific job ID is requested
    if (jobId) {
      const job = await Job.findById(jobId);
      
      if (!job) {
        return NextResponse.json(
          { error: "Job not found" },
          { status: 404 }
        );
      }
      
      // Check if the job belongs to the user or is public (for applicants)
      if (job.employerId.toString() !== dbUser._id.toString()) {
        // If not the owner, they can only view active jobs
        if (job.status !== 'active') {
          return NextResponse.json(
            { error: "You don't have permission to view this job" },
            { status: 403 }
          );
        }
      }
      
      return NextResponse.json({ job }, { status: 200 });
    } else {
      // Return all jobs for this user
      const jobs = await Job.find({ employerId: dbUser._id })
        .sort({ createdAt: -1 });
      
      return NextResponse.json({ jobs }, { status: 200 });
    }
    
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      { error: "Failed to fetch job data" },
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
    const dbUser = await User.findOne({ email: session.user.email });
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