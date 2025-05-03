"use server"

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ConnectToDatabase } from "@/lib/mongoose";
import mongoose, { Types } from "mongoose";
import { Job } from "@/models/job";
import { Application } from "@/models/application";
import { Notification } from "@/models/notification";
import { Contract, IContract } from "@/models/contract";
import { FreelanceGig } from "@/models/freelance-gig";
import { User } from "@/models/user";

// Define types for dashboard data
interface Milestone {
  title: string;
  description: string;
  dueDate: Date;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
}

interface ActivityItem {
  type: string;
  title: string;
  description: string;
  date: Date;
  entityId: mongoose.Types.ObjectId | string;
  read?: boolean;
}

interface UpcomingMilestone {
  contractId: mongoose.Types.ObjectId | string;
  contractTitle: string;
  title: string;
  description: string;
  dueDate: Date;
  amount: number;
  currency: string;
}

// Define a type for user document returned from lean() query
interface UserDocument {
  _id: mongoose.Types.ObjectId;
  role?: string;
  profileViews?: number;
  [key: string]: any;
}

// GET handler - Fetch all dashboard data for the current user
export async function GET(request: NextRequest) {
  try {
    // Authenticate the user
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Connect to the database
    await ConnectToDatabase();

    // Find the user in the database using the email from session
    const userEmail = session.user.email;
    
    const dbUser = await User.findOne({ email: userEmail });
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }
    
    // Use the MongoDB _id of the user
    const userObjectId = dbUser._id;
    const userId = userObjectId.toString();

    // Fetch all required data concurrently for efficiency
    const [
      applications,
      postedJobs,
      freelanceGigs,
      notifications,
      contracts,
      interviews,
      user
    ] = await Promise.all([
      // Get user's job applications
      Application.find({ applicantId: userObjectId })
        .populate('jobId')
        .lean(),
      
      // Get jobs posted by user
      Job.find({ employerId: userObjectId })
        .lean(),
      
      // Get freelance gigs created by user
      FreelanceGig.find({ userId: userObjectId })
        .lean(),
      
      // Get user notifications (limit to 10 most recent)
      Notification.find({ userId: userObjectId })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      
      // Get user contracts
      Contract.find({
        $or: [
          { clientId: userObjectId },
          { freelancerId: userObjectId }
        ]
      }).lean(),
      
      // Get scheduled interviews (applications with interview status and date)
      Application.find({
        applicantId: userObjectId,
        status: 'interview',
        interviewDate: { $exists: true, $ne: null }
      })
      .populate('jobId')
      .sort({ interviewDate: 1 })
      .lean(),

      // Get the user for profile details and explicitly cast to UserDocument
      User.findById(userObjectId).select('role profileViews').lean() as Promise<UserDocument>
    ]);
    
    // Calculate earnings from contracts (total and this month)
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // For a freelancer: sum of contracts where they are the freelancer
    // For an employer: sum of contracts where they are the client
    const completedContracts = contracts.filter(contract => 
      contract.status === 'completed'
    );
    
    const thisMonthContracts = completedContracts.filter(contract => 
      new Date(contract.updatedAt) >= firstDayOfMonth
    );
    
    // Calculate earnings (freelancer perspective)
    const totalEarnings = completedContracts
      .filter(contract => contract.freelancerId.toString() === userId)
      .reduce((sum, contract) => sum + contract.paymentAmount, 0);
      
    const monthlyEarnings = thisMonthContracts
      .filter(contract => contract.freelancerId.toString() === userId)
      .reduce((sum, contract) => sum + contract.paymentAmount, 0);
      
    // Calculate spending (client perspective)  
    const totalSpending = completedContracts
      .filter(contract => contract.clientId.toString() === userId)
      .reduce((sum, contract) => sum + contract.paymentAmount, 0);
      
    const monthlySpending = thisMonthContracts
      .filter(contract => contract.clientId.toString() === userId)
      .reduce((sum, contract) => sum + contract.paymentAmount, 0);
    
    // Cast user to UserDocument to access properties safely
    const userDoc = user as UserDocument;
    
    // Calculate dashboard statistics
    const dashboardStats = {
      applications: {
        total: applications.length,
        interviews: applications.filter(app => app.status === 'interview').length,
        offers: applications.filter(app => app.status === 'offered').length,
        rejected: applications.filter(app => app.status === 'rejected').length,
        pending: applications.filter(app => app.status === 'pending').length,
      },
      jobs: {
        total: postedJobs.length,
        active: postedJobs.filter(job => job.status === 'active').length,
        expired: postedJobs.filter(job => job.status === 'expired').length,
        draft: postedJobs.filter(job => job.status === 'draft').length,
        applicantsCount: postedJobs.reduce((sum, job) => sum + (job.applicantsCount || 0), 0),
      },
      freelance: {
        total: freelanceGigs.length,
        active: freelanceGigs.filter(gig => gig.status === 'active').length,
        pending: freelanceGigs.filter(gig => gig.status === 'pending').length,
        inactive: freelanceGigs.filter(gig => gig.status === 'inactive').length,
      },
      contracts: {
        total: contracts.length,
        active: contracts.filter(contract => contract.status === 'active').length,
        completed: contracts.filter(contract => contract.status === 'completed').length,
        pending: contracts.filter(contract => contract.status === 'pending').length,
        totalValue: contracts.reduce((sum, contract) => sum + contract.paymentAmount, 0),
      },
      finances: {
        totalEarnings,
        monthlyEarnings,
        totalSpending,
        monthlySpending,
        currency: completedContracts.length > 0 ? completedContracts[0].currency : 'USD',
      },
      profile: {
        // Safely access properties with proper type checking
        views: userDoc?.profileViews || 0,
        role: userDoc?.role || 'Freelancer',
      },
      notifications: {
        total: notifications.length,
        unread: notifications.filter(notif => !notif.read).length,
      },
      pendingTasks: interviews.length + contracts.filter(contract => contract.status === 'pending').length,
    };

    // Format recent activities based on actual data
    const recentActivity: ActivityItem[] = [
      // Job applications
      ...applications.slice(0, 3).map(app => ({
        type: 'application',
        title: `Job Application Submitted`,
        description: `${app.jobId?.title || 'Job'} at ${app.jobId?.company || 'Company'}`,
        date: app.appliedAt,
        entityId: app._id as mongoose.Types.ObjectId,
      })),
      
      // Interviews
      ...interviews.slice(0, 3).map(interview => ({
        type: 'interview',
        title: 'Interview Scheduled',
        description: `${interview.jobId?.title || 'Position'} at ${interview.jobId?.company || 'Company'}`,
        date: interview.interviewDate,
        entityId: interview._id as mongoose.Types.ObjectId,
      })),
      
      // Recent contracts
      ...contracts.slice(0, 3).map(contract => ({
        type: 'contract',
        title: contract.status === 'pending' ? 'Contract Pending' : 
               contract.status === 'active' ? 'Contract Active' :
               contract.status === 'completed' ? 'Contract Completed' : 
               'Contract Updated',
        description: contract.title,
        date: contract.updatedAt || contract.createdAt,
        entityId: contract._id as mongoose.Types.ObjectId,
      })),
      
      // Recent notifications
      ...notifications.slice(0, 3).map(notification => ({
        type: notification.type,
        title: notification.title,
        description: notification.message,
        date: notification.createdAt,
        entityId: notification._id as mongoose.Types.ObjectId,
        read: notification.read,
      })),
    ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date descending
    .slice(0, 6); // Limit to 6 items

    // Get upcoming milestones from active contracts
    const upcomingMilestones: UpcomingMilestone[] = contracts
      .filter(contract => contract.status === 'active' && contract.milestones && contract.milestones.length > 0)
      .flatMap(contract => 
        contract.milestones
          .filter((milestone: Milestone) => milestone.status === 'pending')
          .map((milestone: Milestone) => ({
            contractId: contract._id,
            contractTitle: contract.title,
            title: milestone.title,
            description: milestone.description,
            dueDate: milestone.dueDate,
            amount: milestone.amount,
            currency: contract.currency,
          }))
      )
      .sort((a: UpcomingMilestone, b: UpcomingMilestone) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) // Sort by due date ascending
      .slice(0, 5); // Limit to 5 upcoming milestones

    // Return the full dashboard data
    return NextResponse.json({
      user: {
        id: userId,
        name: session.user.name,
        email: session.user.email,
        role: dashboardStats.profile.role,
      },
      stats: dashboardStats,
      applications: applications.slice(0, 5), // Limit to 5 most recent
      postedJobs: postedJobs.slice(0, 5), // Limit to 5 most recent
      freelanceGigs: freelanceGigs.slice(0, 5), // Limit to 5 most recent
      notifications: notifications.slice(0, 5), // Limit to 5 most recent
      contracts: contracts.slice(0, 5), // Limit to 5 most recent
      interviews: interviews.slice(0, 5), // Limit to 5 most recent
      recentActivity: recentActivity,
      upcomingMilestones: upcomingMilestones,
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}