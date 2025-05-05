import { NextResponse } from "next/server";
import { ConnectToDatabase } from "@/lib/mongoose";
import { WorkerProfile } from "@/models/freelance-collab";

export async function GET(
  request: Request,
  { params }: { params: { workerId: string } }
) {
  try {
    await ConnectToDatabase();
    const workerId = params.workerId;
    
    // Handle possible non-MongoDB IDs for testing or demo data
    let profile;
    
    if (workerId.startsWith('worker-')) {
      // This is a demo worker, get by index or similar demo ID
      const demoId = parseInt(workerId.replace('worker-', ''));
      // For demo purposes, fetch the first profile or implement demo data
      profile = await WorkerProfile.findOne().skip(demoId).limit(1);
    } else {
      // This is a real MongoDB ID
      profile = await WorkerProfile.findById(workerId);
    }

    if (!profile) {
      return NextResponse.json(
        { success: false, error: "Worker profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, profile }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching worker profile:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch worker profile" },
      { status: 500 }
    );
  }
}