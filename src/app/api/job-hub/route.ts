import { NextRequest, NextResponse } from "next/server";
import { ConnectToDatabase } from "@/lib/mongoose";
import { Job } from "@/models/job";

export async function GET(request: NextRequest) {
  try {
    // Connect to the database
    await ConnectToDatabase();

    // Parse query parameters for filtering
    const url = new URL(request.url);
    const jobType = url.searchParams.get('jobType');
    const location = url.searchParams.get('location');
    const industry = url.searchParams.get('industry');
    const experienceLevel = url.searchParams.get('experienceLevel');
    const minSalary = url.searchParams.get('minSalary');
    const maxSalary = url.searchParams.get('maxSalary');
    const status = url.searchParams.get('status') || 'active'; // Default to active jobs
    const remoteOption = url.searchParams.get('remoteOption');
    const skill = url.searchParams.get('skill');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const page = parseInt(url.searchParams.get('page') || '1');

    // Build query object
    const query: any = { status: status };

    if (jobType) query.jobType = jobType;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (industry) query.industry = { $regex: industry, $options: 'i' };
    if (experienceLevel) query.experienceLevel = experienceLevel;
    if (remoteOption) query.remoteOption = remoteOption;

    // Handle salary range
    if (minSalary || maxSalary) {
      query.salary = {};
      if (minSalary) query.salary.min = { $gte: parseInt(minSalary) };
      if (maxSalary) query.salary.max = { $lte: parseInt(maxSalary) };
    }

    // Handle skills filtering
    if (skill) {
      query.skills = { $in: [skill] };
    }

    // Execute the query with pagination
    const skip = (page - 1) * limit;
    const totalJobs = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);

    // Return the jobs with pagination metadata
    return NextResponse.json({
      success: true,
      jobs,
      pagination: {
        total: totalJobs,
        page,
        limit,
        pages: Math.ceil(totalJobs / limit),
      }
    });
  } catch (error: any) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await ConnectToDatabase();

    // Parse the request body
    const body = await request.json();

    // Create a new job
    const job = await Job.create(body);

    return NextResponse.json({
      success: true,
      message: "Job created successfully",
      job,
    }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create job" },
      { status: 500 }
    );
  }
}