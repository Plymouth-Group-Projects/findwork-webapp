import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ConnectToDatabase } from "@/lib/mongoose";
import { Contract } from "@/models/contract";
import { WorkerProfile } from "@/models/freelance-collab";
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
    await ConnectToDatabase();

    // Get worker and client details
    const workerId = checkoutSession.metadata?.workerId;
    const userId = checkoutSession.metadata?.userId;
    
    // Verify that the session is for the current user
    if (userId !== session.user.id) {
      return NextResponse.json({ 
        success: false, 
        error: "Unauthorized: User ID mismatch" 
      }, { status: 403 });
    }

    const worker = workerId ? await WorkerProfile.findById(workerId) : null;
    const client = await User.findById(userId);

    if (!worker || !client) {
      return NextResponse.json({ 
        success: false, 
        error: "Worker or client not found" 
      }, { status: 404 });
    }
    
    // Check if we've already processed this payment
    const existingContract = await Contract.findOne({ stripeSessionId: sessionId });
    
    let contract;
    
    // If contract doesn't exist, create a new one
    if (!existingContract && checkoutSession.payment_status === "paid") {
      // Calculate the amount in dollars
      const amountInDollars = (checkoutSession.amount_total || 0) / 100;
      
      // Create a new contract
      contract = await Contract.create({
        workerId: workerId,
        clientId: userId,
        title: `Contract with ${worker.name}`,
        description: `Service contract for ${worker.name}`,
        amount: amountInDollars,
        status: "active",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now by default
        createdAt: new Date(),
        updatedAt: new Date(),
        stripeSessionId: sessionId,
        stripePaymentIntentId: checkoutSession.payment_intent,
      });
    } else {
      contract = existingContract;
    }
    
    // Return payment details
    return NextResponse.json({ 
      success: true,
      payment: {
        amount: ((checkoutSession.amount_total || 0) / 100).toFixed(2),
        currency: checkoutSession.currency?.toUpperCase(),
        status: checkoutSession.payment_status,
        workerName: worker.name,
        contractId: contract?._id,
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