import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import mongoose from 'mongoose';
import { ConnectToDatabase } from '@/lib/mongoose';
import { authOptions } from '@/lib/auth';
import { Contract } from '@/models/contract';
import { User } from '@/models/user';

// Helper function to validate ObjectId
const isValidObjectId = (id: string) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Interface for the user document returned from lean query
interface UserDocument {
  _id: mongoose.Types.ObjectId;
  name: string;
  email?: string;
  [key: string]: any;
}

// Interface for milestone document
interface MilestoneDocument {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  dueDate: Date;
  amount: number;
  status: string;
  [key: string]: any;
}

// GET handler - Fetch contracts for the current user
export async function GET(request: NextRequest) {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions);

    // Check authentication
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Connect to the database
    await ConnectToDatabase();
    
    // Find the user in the database using the email from session
    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not found in session" },
        { status: 400 }
      );
    }
    
    // Get the database user with their MongoDB ObjectId
    const dbUser = await User.findOne({ email: userEmail });
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }
    
    // Use the MongoDB ObjectId from the database
    const userObjectId = dbUser._id;

    // Find contracts where user is either client or freelancer
    const contracts = await Contract.find({
      $or: [
        { clientId: userObjectId },
        { freelancerId: userObjectId }
      ]
    })
    .sort({ createdAt: -1 }) // Sort by creation date, newest first
    .lean(); // Convert to plain objects

    // Get all unique user IDs from contracts for client and freelancer
    const userIds = [...new Set([
      ...contracts.map(contract => contract.clientId.toString()),
      ...contracts.map(contract => contract.freelancerId.toString())
    ])];

    // Fetch user names for these IDs
    const users = await User.find({
      _id: { $in: userIds }
    })
    .select('_id name')
    .lean();

    // Create a lookup map for user names
    const userMap = users.reduce((acc, user) => {
      if (user._id && typeof user.name === 'string') {
        acc[user._id.toString()] = user.name;
      }
      return acc;
    }, {} as Record<string, string>);

    // Enrich contracts with name information for better display
    const enrichedContracts = contracts.map(contract => {
      const clientName = userMap[contract.clientId.toString()];
      const freelancerName = userMap[contract.freelancerId.toString()];
      
      return {
        ...contract,
        clientName,
        freelancerName,
      };
    });

    // Return the contracts as JSON
    return NextResponse.json({
      contracts: enrichedContracts
    });
    
  } catch (error) {
    console.error('Error fetching contracts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contracts' },
      { status: 500 }
    );
  }
}

// POST handler - Create a new contract
export async function POST(request: NextRequest) {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions);

    // Check authentication
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
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

    // Parse request body
    const body = await request.json();

    // Basic validation
    const requiredFields = ['title', 'description', 'freelancerId', 'startDate', 'paymentTerms', 'paymentAmount'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate IDs
    if (!isValidObjectId(body.freelancerId)) {
      return NextResponse.json(
        { error: 'Invalid freelancer ID format' },
        { status: 400 }
      );
    }

    // Connect to the database
    await ConnectToDatabase();
    
    // Get the database user with their MongoDB ObjectId
    const dbUser = await User.findOne({ email: userEmail });
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    // Create the contract using the database user ID
    const contract = new Contract({
      title: body.title,
      description: body.description,
      clientId: dbUser._id, // Use DB user ID instead of session ID
      freelancerId: new mongoose.Types.ObjectId(body.freelancerId),
      jobId: body.jobId ? new mongoose.Types.ObjectId(body.jobId) : undefined,
      startDate: new Date(body.startDate),
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      paymentTerms: body.paymentTerms,
      paymentAmount: body.paymentAmount,
      currency: body.currency || 'USD',
      status: 'pending', // New contracts start as pending
      milestones: body.milestones || [],
      attachments: body.attachments || [],
    });

    // Save the contract
    await contract.save();

    // Return the created contract
    return NextResponse.json({
      contract,
      message: 'Contract created successfully'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating contract:', error);
    return NextResponse.json(
      { error: 'Failed to create contract' },
      { status: 500 }
    );
  }
}

// PUT handler - Update contract status (accept, reject, complete)
export async function PUT(request: NextRequest) {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions);

    // Check authentication
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    
    // Validate input
    if (!body.contractId || !body.action) {
      return NextResponse.json(
        { error: 'Missing contractId or action' },
        { status: 400 }
      );
    }

    // Validate contract ID
    if (!isValidObjectId(body.contractId)) {
      return NextResponse.json(
        { error: 'Invalid contract ID format' },
        { status: 400 }
      );
    }

    // Connect to the database
    await ConnectToDatabase();
    
    // Find the user in the database using the email from session
    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not found in session" },
        { status: 400 }
      );
    }
    
    // Get the database user with their MongoDB ObjectId
    const dbUser = await User.findOne({ email: userEmail });
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }
    
    // Use the MongoDB ObjectId from the database
    const userObjectId = dbUser._id;
    
    // Find the contract
    const contract = await Contract.findById(body.contractId);
    
    if (!contract) {
      return NextResponse.json(
        { error: 'Contract not found' },
        { status: 404 }
      );
    }

    // Verify ownership (either client or freelancer)
    // Use the database user ID for comparison with contract IDs
    if (
      contract.clientId.toString() !== userObjectId.toString() &&
      contract.freelancerId.toString() !== userObjectId.toString()
    ) {
      return NextResponse.json(
        { error: 'Not authorized to modify this contract' },
        { status: 403 }
      );
    }

    // Handle different actions
    switch (body.action) {
      case 'accept':
        // Only freelancer can accept contracts
        if (contract.freelancerId.toString() !== userObjectId.toString()) {
          return NextResponse.json(
            { error: 'Only freelancers can accept contracts' },
            { status: 403 }
          );
        }
        
        if (contract.status !== 'pending') {
          return NextResponse.json(
            { error: 'Only pending contracts can be accepted' },
            { status: 400 }
          );
        }
        
        contract.status = 'active';
        break;
        
      case 'reject':
        // Only freelancer can reject contracts
        if (contract.freelancerId.toString() !== userObjectId.toString()) {
          return NextResponse.json(
            { error: 'Only freelancers can reject contracts' },
            { status: 403 }
          );
        }
        
        if (contract.status !== 'pending') {
          return NextResponse.json(
            { error: 'Only pending contracts can be rejected' },
            { status: 400 }
          );
        }
        
        contract.status = 'cancelled';
        break;
        
      case 'complete':
        // Both parties can mark as complete
        if (contract.status !== 'active') {
          return NextResponse.json(
            { error: 'Only active contracts can be completed' },
            { status: 400 }
          );
        }
        
        contract.status = 'completed';
        break;
        
      case 'dispute':
        // Both parties can raise disputes
        if (contract.status !== 'active' && contract.status !== 'completed') {
          return NextResponse.json(
            { error: 'Only active or completed contracts can be disputed' },
            { status: 400 }
          );
        }
        
        contract.status = 'disputed';
        break;
        
      case 'update-milestone':
        // Validate milestone data
        if (!body.milestoneId || !body.milestoneStatus) {
          return NextResponse.json(
            { error: 'Missing milestone details' },
            { status: 400 }
          );
        }
        
        // Find and update the milestone
        const milestoneIndex = contract.milestones?.findIndex(
          (m: MilestoneDocument) => m._id.toString() === body.milestoneId
        );
        
        if (milestoneIndex === -1 || milestoneIndex === undefined || !contract.milestones) {
          return NextResponse.json(
            { error: 'Milestone not found' },
            { status: 404 }
          );
        }
        
        contract.milestones[milestoneIndex].status = body.milestoneStatus;
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Save the updated contract
    await contract.save();

    // Return the updated contract
    return NextResponse.json({
      contract,
      message: `Contract ${body.action} successful`
    });
    
  } catch (error) {
    console.error('Error updating contract:', error);
    return NextResponse.json(
      { error: 'Failed to update contract' },
      { status: 500 }
    );
  }
}