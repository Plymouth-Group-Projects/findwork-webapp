import { NextRequest, NextResponse } from "next/server";
import { ConnectToDatabase } from "@/lib/mongoose";
import { Job } from "@/models/job";
import mongoose from "mongoose";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, props: Params) {
  const params = await props.params;
  try {
    // Connect to the database
    await ConnectToDatabase();

    const { id } = params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid job ID" },
        { status: 400 }
      );
    }

    // Find the job by ID
    const job = await Job.findById(id);

    // Check if the job exists
    if (!job) {
      return NextResponse.json(
        { success: false, error: "Job not found" },
        { status: 404 }
      );
    }

    // Return the job data
    return NextResponse.json({
      success: true,
      job,
    });
  } catch (error: any) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch job" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, props: Params) {
  const params = await props.params;
  try {
    // Connect to the database
    await ConnectToDatabase();

    const { id } = params;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid job ID" },
        { status: 400 }
      );
    }

    // Parse the request body
    const body = await request.json();

    // Update the job by ID
    const updatedJob = await Job.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    // Check if the job exists
    if (!updatedJob) {
      return NextResponse.json(
        { success: false, error: "Job not found" },
        { status: 404 }
      );
    }

    // Return the updated job data
    return NextResponse.json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error: any) {
    console.error("Error updating job:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update job" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, props: Params) {
  const params = await props.params;
  try {
    // Connect to the database
    await ConnectToDatabase();

    const { id } = params;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid job ID" },
        { status: 400 }
      );
    }

    // Delete the job by ID
    const deletedJob = await Job.findByIdAndDelete(id);

    // Check if the job exists
    if (!deletedJob) {
      return NextResponse.json(
        { success: false, error: "Job not found" },
        { status: 404 }
      );
    }

    // Return success message
    return NextResponse.json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting job:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete job" },
      { status: 500 }
    );
  }
}