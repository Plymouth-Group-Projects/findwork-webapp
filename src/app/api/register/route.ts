"use server"

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { ConnectToDatabase } from '@/lib/mongoose';
import { User } from '@/models/user';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      phone, 
      gender, 
      dob 
    } = body;

    // Check if required fields are present
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to database
    await ConnectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with Mongoose
    const user = await User.create({
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      gender,
      dateOfBirth: dob,
      provider: 'credentials',
      lastLogin: new Date()
    });

    // Return user without sensitive fields
    // The toJSON transform in the schema will handle removing the password
    return NextResponse.json(user);
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
