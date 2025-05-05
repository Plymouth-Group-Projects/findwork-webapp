import { NextResponse } from "next/server";
import { ConnectToDatabase } from "@/lib/mongoose";
import { WorkerProfile } from "@/models/freelance-collab";

export async function GET(request: Request) {
  try {
    // Connect to the database
    await ConnectToDatabase();
    
    // Get search parameters from URL
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const skill = url.searchParams.get("skill");
    const level = url.searchParams.get("level");
    const searchQuery = url.searchParams.get("search");
    const location = url.searchParams.get("location");
    const availability = url.searchParams.get("availability");
    const minRateStr = url.searchParams.get("minRate");
    const maxRateStr = url.searchParams.get("maxRate");
    const rateType = url.searchParams.get("rateType");
    const workTypes = url.searchParams.getAll("workType");
    
    // Build query object
    const query: any = { status: "active" };
    
    if (category) {
      query.category = category;
    }
    
    if (skill) {
      query.topSkills = { $in: [skill] };
    }
    
    if (level) {
      query.level = level;
    }
    
    if (searchQuery) {
      query.$text = { $search: searchQuery };
    }
    
    if (location) {
      query["contact.address"] = { $regex: location, $options: "i" };
    }
    
    if (availability) {
      query.availability = { $regex: availability, $options: "i" };
    }
    
    // Handle salary filtering
    if (minRateStr || maxRateStr) {
      const minRate = minRateStr ? parseInt(minRateStr) : 0;
      const maxRate = maxRateStr ? parseInt(maxRateStr) : 100000;
      
      // Extract numeric part from the salary field to compare
      // This is a simplified approach - in a real app, you'd need a more structured salary field
      query.salary = {
        $regex: new RegExp(`(${minRate}|${minRate + 1}|${maxRate}|[${minRate}-${maxRate}])`, "i")
      };
    }
    
    if (workTypes && workTypes.length > 0) {
      // In a real implementation, you might have a dedicated field for work types
      // This is a simplified example using the availability field
      query.availability = { 
        $regex: workTypes.join("|"), 
        $options: "i" 
      };
    }
    
    // Fetch worker profiles with pagination
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    
    const profiles = await WorkerProfile.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();
      
    const totalProfiles = await WorkerProfile.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      profiles,
      pagination: {
        total: totalProfiles,
        page,
        limit,
        pages: Math.ceil(totalProfiles / limit)
      }
    });
    
  } catch (error: any) {
    console.error("Error fetching worker profiles:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch worker profiles" },
      { status: 500 }
    );
  }
}