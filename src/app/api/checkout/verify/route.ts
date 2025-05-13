import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ConnectToDatabase } from "@/lib/mongoose";
import { WorkerProfile } from "@/models/freelance-collab";
import { HiredCollaboration } from "@/models/hired-collab";
import { User } from "@/models/user";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-04-30.basil", // Updated to the latest required API version
});

export async function GET(request: Request) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({
        success: false, 
        error: "Unauthorized" 
      }, { status: 401 });
    }
    
    // Get session ID from query parameters
    const url = new URL(request.url);
    const sessionId = url.searchParams.get("session_id");
    
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

    // Connect to the database
    await ConnectToDatabase();    // Get worker and client details
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

    const worker = workerId ? await WorkerProfile.findById(workerId) : null;
    const client = dbUser; // Use the already fetched user

    if (!worker || !client) {
      return NextResponse.json({ 
        success: false, 
        error: "Worker or client not found" 
      }, { status: 404 });
    }
      // Check if we've already processed this payment and created a hired collaboration
    const existingCollaboration = await HiredCollaboration.findOne({ stripeSessionId: sessionId });
      // Return payment details
    return NextResponse.json({ 
      success: true,
      payment: {
        amount: ((checkoutSession.amount_total || 0) / 100).toFixed(2),
        currency: checkoutSession.currency?.toUpperCase(),
        status: checkoutSession.payment_status,
        workerName: worker.name,
        collaborationId: existingCollaboration?._id,
      }
    }, { status: 200 });
    
  } catch (error: any) {
    console.error("Error verifying payment:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed to verify payment" 
    }, { status: 500 });
  }
}