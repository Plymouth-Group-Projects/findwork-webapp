import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ConnectToDatabase } from "@/lib/mongoose";
import Stripe from "stripe";
import { WorkerProfile } from "@/models/freelance-collab";
import { HiredCollaboration } from "@/models/hired-collab";
import { User } from "@/models/user";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-04-30.basil",
});

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await ConnectToDatabase();
    
    // Get the authenticated user
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ 
        success: false, 
        error: "Unauthorized" 
      }, { status: 401 });
    }
    
    // Parse request body
    const body = await request.json();
    const { sessionId } = body;
    
    if (!sessionId) {
      return NextResponse.json({ 
        success: false, 
        error: "Missing session ID" 
      }, { status: 400 });
    }
    
    // Retrieve the checkout session from Stripe
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (!checkoutSession) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid session ID" 
      }, { status: 400 });
    }

    // Check if payment was successful
    if (checkoutSession.payment_status !== "paid") {
      return NextResponse.json({ 
        success: false, 
        error: "Payment not completed" 
      }, { status: 400 });
    }    // Get worker and client details
    const workerId = checkoutSession.metadata?.workerId;
    const sessionUserId = checkoutSession.metadata?.userId;
    
    // Get the MongoDB ObjectId of the user from the database using their email
    const dbUser = await User.findOne({ email: session.user.email });
    
    if (!dbUser) {
      return NextResponse.json({ 
        success: false, 
        error: "User not found in database" 
      }, { status: 404 });
    }
    
    // Use the MongoDB ObjectId from the database
    const userId = dbUser._id;
    
    // Verify that the session user matches the checkout user (by email)
    if (sessionUserId !== session.user.id) {
      return NextResponse.json({ 
        success: false, 
        error: "Unauthorized: User ID mismatch" 
      }, { status: 403 });
    }

    // Find the worker profile
    const workerProfile = workerId ? await WorkerProfile.findById(workerId) : null;
    
    if (!workerProfile) {
      return NextResponse.json({ 
        success: false, 
        error: "Worker profile not found" 
      }, { status: 404 });
    }
      // Check if a hired collaboration already exists for this session
    const existingHire = await HiredCollaboration.findOne({
      clientId: userId,
      originalProfileId: workerId,
      stripeSessionId: sessionId
    });
    
    if (existingHire) {
      return NextResponse.json({ 
        success: true, 
        message: "Collaboration already created",
        collabId: existingHire._id
      }, { status: 200 });
    }// Calculate the payment amount in dollars
    const amountInDollars = (checkoutSession.amount_total || 0) / 100;
    
    // Create the hired collaboration
    const profileData = workerProfile.toObject();
    
    // Remove MongoDB specific fields
    delete profileData._id;
    delete profileData.__v;
    
    // Create new hired collaboration
    const hiredCollaboration = await HiredCollaboration.create({
      ...profileData,
      clientId: userId,
      originalProfileId: workerId,
      hiredDate: new Date(),
      projectTitle: `Project with ${workerProfile.name}`,
      projectDescription: `Collaboration with ${workerProfile.name} for ${workerProfile.category || 'services'}`,
      paymentTerms: `$${amountInDollars.toFixed(2)} paid via Stripe`,
      paymentAmount: amountInDollars,
      currentStatus: 'active',
      stripeSessionId: sessionId
    });

    return NextResponse.json({ 
      success: true, 
      message: "Collaboration created successfully",
      collabId: hiredCollaboration._id
    }, { status: 201 });
    
  } catch (error: any) {
    console.error("Error creating hired collaboration:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed to create hired collaboration" 
    }, { status: 500 });
  }
}
