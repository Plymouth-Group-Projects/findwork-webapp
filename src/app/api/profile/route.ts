import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ConnectToDatabase } from '@/lib/mongoose';
import { User, IUser } from '@/models/user';

// GET handler - Fetch the current user's profile
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
    
    // Get the database user with their MongoDB ObjectId (password excluded by Schema)
    const user = await User.findOne({ email: userEmail }).lean();
      
    if (!user) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }
    
    // Return user profile data
    return NextResponse.json(user);
    
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT handler - Update the current user's profile
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

    // Connect to the database
    await ConnectToDatabase();
    
    // Parse the request body
    const data = await request.json();
    
    // Find the user in the database using the email from session
    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not found in session" },
        { status: 400 }
      );
    }
    
    // Get fields that are allowed to be updated based on our model
    const {
      firstName,
      lastName,
      phone,
      gender,
      dateOfBirth,
      image,
      // Avoid updating these sensitive/restricted fields
      email, password, role, provider, _id, createdAt, updatedAt, profileViews, ...otherFields
    } = data;
    
    // Create the update object with only allowed fields
    const updateData: Partial<IUser> = {};
    
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    // Ensure name is consistent with first and last name
    if (firstName || lastName) {
      const user = await User.findOne({ email: userEmail });
      const newFirstName = firstName || user?.firstName || '';
      const newLastName = lastName || user?.lastName || '';
      updateData.name = `${newFirstName} ${newLastName}`.trim();
    }
    if (phone) updateData.phone = phone;
    if (gender) updateData.gender = gender;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    if (image) updateData.image = image;
    
    // Include any other valid fields that are in our model
    // but not explicitly handled above
    const allowedFields = ['name'];
    for (const [key, value] of Object.entries(otherFields)) {
      if (allowedFields.includes(key)) {
        (updateData as any)[key] = value;
      }
    }
    
    // Update user in database
    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }
    
    // Return updated user data (password will be excluded by Schema)
    return NextResponse.json(updatedUser);
    
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors: Record<string, string> = {};
      
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      
      return NextResponse.json(
        { error: 'Validation Error', validationErrors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}