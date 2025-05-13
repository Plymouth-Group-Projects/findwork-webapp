import { ConnectToDatabase } from '@/lib/mongoose';
import { Job } from '@/models/job'; 
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';

// GET: Fetch a job by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await ConnectToDatabase();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.user?.email) {
      return NextResponse.json({ error: 'User email not found in session' }, { status: 400 });
    }

    // Get the actual user from database using email
    const user = await mongoose.models.User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }
    
    const job = await Job.findOne({
      _id: id,
      employerId: user._id // Use the actual database ObjectId
    }).populate('employerId', 'name email');

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ job }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching job details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job details' },
      { status: 500 }
    );
  }
}

// PUT: Update a job completely
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await ConnectToDatabase();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.user?.email) {
      return NextResponse.json({ error: 'User email not found in session' }, { status: 400 });
    }

    // Get the actual user from database using email
    const user = await mongoose.models.User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    const jobData = await req.json();

    // Find job and check ownership
    const existingJob = await Job.findOne({
      _id: id,
      employerId: user._id, // Use the actual database ObjectId
    });

    if (!existingJob) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Update the job with validation
    const updatedJob = await Job.findByIdAndUpdate(
      id,
      { ...jobData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ job: updatedJob }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating job:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 }
    );
  }
}

// PATCH: Update specific fields of a job
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await ConnectToDatabase();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.user?.email) {
      return NextResponse.json({ error: 'User email not found in session' }, { status: 400 });
    }

    // Get the actual user from database using email
    const user = await mongoose.models.User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    const updates = await req.json();

    // Find job and check ownership
    const existingJob = await Job.findOne({
      _id: id,
      employerId: user._id, // Use the actual database ObjectId
    });

    if (!existingJob) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Update only the specified fields
    const updatedJob = await Job.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ job: updatedJob }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating job fields:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update job fields' },
      { status: 500 }
    );
  }
}

// DELETE: Remove a job
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await ConnectToDatabase();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.user?.email) {
      return NextResponse.json({ error: 'User email not found in session' }, { status: 400 });
    }

    // Get the actual user from database using email
    const user = await mongoose.models.User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    // Find job and check ownership
    const existingJob = await Job.findOne({
      _id: id,
      employerId: user._id, // Use the actual database ObjectId
    });

    if (!existingJob) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Delete the job
    await Job.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: 'Job deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    );
  }
}