/**
 * Environment configuration helper
 * Dynamically sets environment variables based on NODE_ENV
 */

// Define interface for exported config
interface EnvironmentConfig {
  port: number;
  isDevelopment: boolean;
  nextAuthUrl: string;
  apiUrl: string;
  productionUrl: string;
}

// Determine the current environment
const isDevelopment: boolean = process.env.NODE_ENV === 'development';

// Production URL for Vercel deployment
const PRODUCTION_URL = 'https://findwork-webapp.vercel.app';

// Set the correct port
const port: number = isDevelopment 
  ? Number(process.env.PORT_DEVELOPMENT) || 3000
  : Number(process.env.PORT_PRODUCTION) || 8080;

// Set environment variables if they're not already defined
if (!process.env.PORT) {
  process.env.PORT = port.toString();
}

if (!process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = isDevelopment 
    ? `http://localhost:${port}`
    : PRODUCTION_URL;
}

if (!process.env.NEXT_PUBLIC_API_URL) {
  process.env.NEXT_PUBLIC_API_URL = isDevelopment
    ? `http://localhost:${port}/api`
    : `${PRODUCTION_URL}/api`;
}

const config: EnvironmentConfig = {
  port,
  isDevelopment,
  nextAuthUrl: process.env.NEXTAUTH_URL as string,
  apiUrl: process.env.NEXT_PUBLIC_API_URL as string,
  productionUrl: PRODUCTION_URL
};

export default config;
