import mongoose, { Schema, Document } from 'mongoose';

// Define the user interface with TypeScript
export interface IUser extends Document {
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  image?: string;
  provider: 'credentials' | 'google' | 'facebook';
  role: string;
  profileViews: number;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema with validation and options
const UserSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
    },
    phone: {
      type: String,
    },
    gender: {
      type: String,
    },
    dateOfBirth: {
      type: String,
    },
    image: {
      type: String,
    },
    provider: {
      type: String,
      default: 'credentials',
      enum: ['credentials', 'google', 'facebook'],
    },
    role: {
      type: String,
      default: 'Freelancer',
      enum: ['Freelancer', 'Employer', 'Client', 'Admin'],
    },
    profileViews: {
      type: Number,
      default: 0,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    // Optimize document storage
    minimize: true,
    // Create lean JSON when retrieving data
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password; // Never send password
        delete ret.__v; // Remove version key
        return ret;
      },
    },
  }
);

// Prevent model recompilation when the file is imported multiple times
export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
