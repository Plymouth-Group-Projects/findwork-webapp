import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { headers } from "next/headers";
import { ConnectToDatabase } from "@/lib/mongoose";
import { User } from "@/models/user";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-04-30.basil", // Updated to the latest required API version
});

// Helper to get base URL
async function getBaseUrl() {
  // First try the NEXT_PUBLIC_APP_URL env variable
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  
  // Otherwise construct from request headers
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = headersList.get("x-forwarded-proto") || "http";
  
  return `${protocol}://${host}`;
}

export async function POST(request: Request) {
  try {    // Get the authenticated user
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ 
        success: false, 
        error: "You must be logged in to make a payment" 
      }, { status: 401 });
    }
    
    // Connect to database
    await ConnectToDatabase();
    
    // Parse request body
    const body = await request.json();
    const { workerId, workerName, price, description } = body;
    
    if (!workerId || !price) {
      return NextResponse.json({ 
        success: false, 
        error: "Missing required fields" 
      }, { status: 400 });
    }
    
    // Calculate price in cents (Stripe requires amounts in smallest currency unit)
    const amount = Math.round(parseFloat(price) * 100);
    
    // Get base URL for redirects
    const baseUrl = await getBaseUrl();
    
    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {          price_data: {
            currency: "lkr",
            product_data: {
              name: `Hire ${workerName}`,
              description: description || "Worker hiring service",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],      metadata: {
        workerId,
        userId: session.user.id, // We keep this as the OAuth ID since we only use it for verification
      },
      mode: "payment",
      success_url: `${baseUrl}/dashboard/collaboration/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/workforce-hub/${workerId}`,
    });

    return NextResponse.json({ 
      success: true, 
      url: checkoutSession.url 
    }, { status: 200 });
    
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed to create checkout session" 
    }, { status: 500 });
  }
}