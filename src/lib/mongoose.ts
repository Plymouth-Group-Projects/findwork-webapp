"use server";

import mongoose from 'mongoose';

interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseConnection | undefined;
}

const MONGODB_URI = process.env.MONGODB_URL || '';
const MONGODB_DB = process.env.MONGODB_DB || 'findworkDB';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URL environment variable');
}

console.log(`Attempting to connect to database: ${MONGODB_DB}`);

const cached: MongooseConnection = global.mongoose || { conn: null, promise: null };

// Initialize the global mongoose object if it doesn't exist
if (!global.mongoose) {
  global.mongoose = cached;
}

export async function ConnectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const mongoURI = new URL(MONGODB_URI);

    mongoURI.pathname = '';
    
    const opts = {
      bufferCommands: true,
      dbName: MONGODB_DB,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
      minPoolSize: 1,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(mongoURI.toString(), opts)
      .then((mongoose) => {
        // Verify the connected database name
        const dbName = mongoose.connection.db?.databaseName || MONGODB_DB;
        console.log(`MongoDB connection established to ${dbName}`);
        
        if (dbName !== MONGODB_DB) {
          console.warn(`Warning: Connected to ${dbName} instead of ${MONGODB_DB}`);
        }
        
        return mongoose;
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
        cached.promise = null; // Reset on error
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Reset the promise on failure
    throw e;
  }

  return cached.conn; // Return the established connection
}

export async function disconnectFromDatabase() {
  if (cached.conn) {
    await mongoose.disconnect(); // Disconnect from MongoDB
    cached.conn = null; // Reset cached connection
    cached.promise = null; // Reset cached promise
    console.log('Disconnected from MongoDB');
  }
}
