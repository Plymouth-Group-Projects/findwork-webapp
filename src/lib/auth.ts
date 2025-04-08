import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import bcrypt from 'bcryptjs';
import { ConnectToDatabase } from './mongoose';
import { User } from '@/models/user';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization:{
        params:{
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        }
      }
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }
        
        // Connect to DB when needed - important for serverless
        await ConnectToDatabase();
        
        // Add proper type assertion for the lean document
        const user = await User.findOne({ email: credentials.email  }).lean() as (
          { _id: any; name: string; email: string; password: string } | null
        );
        
        if (!user) {
          throw new Error('No user found with this email');
        }
        
        // Check if password exists before comparing
        if (!user.password) {
          throw new Error('This account cannot be used with password login');
        }
        
        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );
        
        if (!passwordMatch) {
          throw new Error('Incorrect password');
        }
        
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  // Use JWT for serverless (stateless) authentication
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: 'auth/login',
    error: 'auth/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && profile) {
        try {
          // Connect to DB when needed
          await ConnectToDatabase();
          
          // Check if user exists
          const existingUser = await User.findOne({ email: user.email });
          
          if (existingUser) {
            // Update existing user with Google credentials
            await User.findByIdAndUpdate(existingUser._id, {
              provider: 'google',
              googleId: profile.sub,
              googleAccessToken: account.access_token,
              googleRefreshToken: account.refresh_token,
              googleTokenExpiry: account.expires_at ? new Date(account.expires_at * 1000) : null,
            });
          } else {
            // Create new user with Google credentials
            await User.create({
              name: user.name,
              email: user.email,
              provider: 'google',
              googleId: profile.sub,
              googleAccessToken: account.access_token,
              googleRefreshToken: account.refresh_token,
              googleTokenExpiry: account.expires_at ? new Date(account.expires_at * 1000) : null,
            });
          }
        } catch (error) {
          console.error("Error storing Google credentials:", error);
          // Still allow sign in even if credential storage fails
        }
      }
      return true;
    },
    // Minimize JWT size for better performance
    async jwt({ token, user}) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  // Make sure to use a strong, environment-based secret
  secret: process.env.NEXTAUTH_SECRET,
  // Enable debug only in development
  debug: process.env.NODE_ENV === 'development',
  // JWT configuration for better serverless performance
  jwt: {
    // Reduce signing/encryption overhead when possible
    secret: process.env.NEXTAUTH_SECRET,
  },
};
