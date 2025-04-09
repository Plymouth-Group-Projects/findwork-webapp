"use server";

import mongoose from 'mongoose';
import { networkInterfaces } from 'os';

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
const MONGODB_ALLOWED_IP = process.env.MONGODB_ALLOWED_IP || '';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URL environment variable');
}

if (!MONGODB_ALLOWED_IP) {
  console.warn('MONGODB_ALLOWED_IP not defined. IP restriction will not be enforced.');
}

// Function to check if current IP is allowed
function isAllowedIP(): boolean {
  if (!MONGODB_ALLOWED_IP) return true; // If no IP restriction is set, allow all

  // Get all network interfaces
  const nets = networkInterfaces();
  const ips: string[] = [];

  // Collect all IPs from network interfaces
  Object.values(nets).forEach(net => {
    if (net) {
      net.forEach(interface_ => {
        if (interface_.family === 'IPv4' && !interface_.internal) {
          ips.push(interface_.address);
        }
      });
    }
  });

  // Check if any of the machine's IPs match the allowed IP
  const isAllowed = MONGODB_ALLOWED_IP === '*' || 
                    ips.includes(MONGODB_ALLOWED_IP) || 
                    MONGODB_ALLOWED_IP.split(',').some(ip => ips.includes(ip.trim()));
  
  if (!isAllowed) {
    console.warn(`Current IP is not in the allowed list. Allowed IPs: ${MONGODB_ALLOWED_IP}`);
  }
  
  return isAllowed;
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

  // Check IP before attempting connection
  if (!isAllowedIP()) {
    throw new Error('Current IP address is not allowed to connect to MongoDB');
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
