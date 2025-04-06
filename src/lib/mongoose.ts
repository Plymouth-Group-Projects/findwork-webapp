"use server";

import mongoose from 'mongoose';

// Define the interface for our cached connection
interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the NodeJS global namespace to include our mongoose property
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseConnection | undefined;
}

// Fix connection string format - the double @ symbol is causing issues
const MONGODB_URI = process.env.MONGODB_URL || '';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URL environment variable');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
const cached: MongooseConnection = global.mongoose || { conn: null, promise: null };

// Initialize the global mongoose object if it doesn't exist
if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Creates a connection to MongoDB using Mongoose
 * Leverages connection caching for serverless environment
 */
export async function ConnectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('MongoDB connection established');
        return mongoose;
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

/**
 * Disconnect from MongoDB
 * Useful for cleanup during testing
 */
export async function disconnectFromDatabase() {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log('Disconnected from MongoDB');
  }
}

// Export mongoose to be used elsewhere in the application
export { mongoose };
