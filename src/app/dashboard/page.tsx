import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { 
  Briefcase, 
  ClipboardCheck, 
  Users, 
  FileText, 
  DollarSign,
  Bell,
  UserCircle,
  ChevronRight,
  Calendar,
  Zap
} from "lucide-react";
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import Footer from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import type { FormatDistanceToNowOptions } from 'date-fns';
import mongoose from 'mongoose';
import { ConnectToDatabase } from '@/lib/mongoose';

// Component to format relative date
const RelativeDate = ({ date }: { date: Date | string }) => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return <>{formatDistanceToNow(dateObj, { addSuffix: true })}</>;
  } catch (error) {
    return <>recently</>;
  }
};

// Format currency (number to string with currency symbol)
const formatCurrency = (amount: number, currency = 'USD') => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  });
  return formatter.format(amount);
};

// Fetch dashboard data from API
async function getDashboardData(userId: string) {
  try {
    // Connect to database
    await ConnectToDatabase();
    
    // Fetch data directly from the API route code to avoid additional HTTP request
    // This is a server component so we can import and execute the API logic directly
    const { GET } = await import('@/app/api/dashboard/route');
    
    // Create a mock request object
    const req = {
      headers: {
        get: () => null
      },
      nextUrl: {
        searchParams: new URLSearchParams()
      }
    } as any;
    
    // Call the API handler directly
    const response = await GET(req);
    
    // Check response status instead of ok property
    if (!response) {
      console.error("No response received from API");
      return { error: "No response from server" };
    }
    
    if (response.status >= 400) {
      // Get the error message from the response
      const errorData = await response.json();
      console.error(`API error (${response.status}):`, errorData?.error || "Unknown error");
      return { 
        error: errorData?.error || `Error fetching data (${response.status})`,
        status: response.status
      };
    }
    
    // Parse the JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  // Protect the dashboard page
  if (!session) {
    redirect('/auth/login');
  }

  // Fetch real data from database
  const dashboardData = await getDashboardData(session.user?.id as string);
  
  // Check if there was an error
  if ('error' in dashboardData) {
    // Handle error with a nice error message
    return (
      <div className="flex min-h-screen">
        <DashboardSidebar session={session} />
        <main className="flex-1 mt-24 lg:mt-20 overflow-auto">
          <div className="container px-4 mx-auto py-10">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-red-800 mb-2">Dashboard Error</h2>
              <p className="text-red-700 mb-4">
                {dashboardData.error === "Invalid user ID format" 
                  ? "Your account ID is in an incorrect format. This may happen if your account was created with a different authentication method."
                  : dashboardData.error}
              </p>
              <p className="text-sm text-red-600">
                Try signing out and signing back in. If the issue persists, please contact support.
              </p>
            </div>
            
            {/* Still show some basic UI components */}
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              {/* Quick actions */}
              <div className="col-span-3 bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
                <div className="grid gap-4 md:grid-cols-4">
                  <Link href="/job-hub">
                    <Button className="w-full">Browse Jobs</Button>
                  </Link>
                  <Link href="/workforce-hub">
                    <Button variant="outline" className="w-full">Find Freelancers</Button>
                  </Link>
                  <Link href="/dashboard/profile">
                    <Button variant="outline" className="w-full">Update Profile</Button>
                  </Link>
                  <Link href="/contact-us">
                    <Button variant="outline" className="w-full">Contact Support</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <Footer/>
        </main>
      </div>
    );
  }

  // Destructure the data for easy access
  const { stats, recentActivity, upcomingMilestones } = dashboardData;
  const userRole = stats.profile.role;
  
  return (
    <div className="flex min-h-screen">
      {/* Pass the session to DashboardSidebar */}
      <DashboardSidebar session={session} />  
      
      {/* Main content */}
      <main className="flex-1 mt-24 lg:mt-20 overflow-auto">
        <div className="container px-4 mx-auto py-10">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-3xl font-bold text-white">Welcome, {session.user?.name?.split(' ')[0] || 'User'}</h1>
            <Badge className="bg-light text-white">{userRole}</Badge>
          </div>
          
          {/* Stats Overview - Enhanced with real data */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {/* Job Seeker Stats */}
            <Card className="border-0 shadow-md bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-darker">Applications</CardTitle>
                <Briefcase className="h-4 w-4 text-light" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-darker">{stats.applications.total}</div>
                <p className="text-xs text-darker/70">
                  {stats.applications.pending} pending, {stats.applications.interviews} interviews
                </p>
              </CardContent>
            </Card>
            
            {/* Freelancer Stats */}
            <Card className="border-0 shadow-md bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-darker">Active Gigs</CardTitle>
                <Zap className="h-4 w-4 text-light" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-darker">{stats.freelance.active}</div>
                <p className="text-xs text-darker/70">
                  {stats.freelance.total} total, {stats.freelance.pending} pending review
                </p>
              </CardContent>
            </Card>
            
            {/* Job Poster Stats */}
            <Card className="border-0 shadow-md bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-darker">Posted Jobs</CardTitle>
                <FileText className="h-4 w-4 text-light" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-darker">{stats.jobs.total}</div>
                <p className="text-xs text-darker/70">{stats.jobs.active} active, {stats.jobs.applicantsCount} applicants</p>
              </CardContent>
            </Card>
            
            {/* Shared Stats */}
            <Card className="border-0 shadow-md bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-darker">Profile Views</CardTitle>
                <UserCircle className="h-4 w-4 text-light" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-darker">{stats.profile.views}</div>
                <p className="text-xs text-darker/70">{stats.contracts.active} active contracts</p>
              </CardContent>
            </Card>
          </div>

          {/* Feature Quick Access Cards */}
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            {/* Job Seeker Card */}
            <Card className="border-0 shadow-md bg-white hover:shadow-lg transition-all">
              <Link href="/job-hub" className="block h-full">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-t-lg">
                  <CardTitle>Find Jobs</CardTitle>
                  <CardDescription className="text-white/90">Apply to jobs that match your skills</CardDescription>
                </CardHeader>
                <CardContent className="pt-5 flex items-center justify-between">
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-blue-500" />
                    <span className="text-sm text-darker">{stats.applications.total} Applications</span>
                  </div>
                  <Button variant="outline" size="sm" className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
                    Browse Jobs
                  </Button>
                </CardContent>
              </Link>
            </Card>

            {/* Job Poster Card */}
            <Card className="border-0 shadow-md bg-white hover:shadow-lg transition-all">
              <Link href="/dashboard/post-job" className="block h-full">
                <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-400 text-white rounded-t-lg">
                  <CardTitle>Post Jobs</CardTitle>
                  <CardDescription className="text-white/90">Create job listings for your business</CardDescription>
                </CardHeader>
                <CardContent className="pt-5 flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-emerald-500" />
                    <span className="text-sm text-darker">{stats.jobs.total} Posted Jobs</span>
                  </div>
                  <Button variant="outline" size="sm" className="border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white">
                    Create Job
                  </Button>
                </CardContent>
              </Link>
            </Card>

            {/* Freelancer Card */}
            <Card className="border-0 shadow-md bg-white hover:shadow-lg transition-all">
              <Link href="/dashboard/skill-post" className="block h-full">
                <CardHeader className="bg-gradient-to-r from-amber-600 to-amber-400 text-white rounded-t-lg">
                  <CardTitle>Freelance</CardTitle>
                  <CardDescription className="text-white/90">Create and manage your freelance services</CardDescription>
                </CardHeader>
                <CardContent className="pt-5 flex items-center justify-between">
                  <div className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-amber-500" />
                    <span className="text-sm text-darker">{stats.freelance.active} Active Gigs</span>
                  </div>
                  <Button variant="outline" size="sm" className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white">
                    Post Service
                  </Button>
                </CardContent>
              </Link>
            </Card>
          </div>

          {/* Recent Activity and Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mb-6">
            <Card className="lg:col-span-4 border-0 shadow-md bg-white">
              <CardHeader className="bg-white rounded-t-lg border-b border-light/50 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-darker">Recent Activity</CardTitle>
                  <CardDescription className="text-darker/70">Your activity from the past 7 days</CardDescription>
                </div>
                <Badge className="bg-light text-white">{stats.pendingTasks} pending</Badge>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="space-y-4">
                  {/* Activity items from real data */}
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity: any, index: number) => {
                      // Select icon and color based on activity type
                      let Icon = ClipboardCheck;
                      let bgColor = "bg-blue-100";
                      let iconColor = "text-blue-600";
                      
                      if (activity.type === 'application') {
                        Icon = ClipboardCheck;
                        bgColor = "bg-blue-100";
                        iconColor = "text-blue-600";
                      } else if (activity.type === 'interview') {
                        Icon = Calendar;
                        bgColor = "bg-green-100";
                        iconColor = "text-green-600";
                      } else if (activity.type === 'contract') {
                        Icon = FileText;
                        bgColor = "bg-purple-100";
                        iconColor = "text-purple-600";
                      } else if (activity.type === 'payment') {
                        Icon = DollarSign;
                        bgColor = "bg-emerald-100";
                        iconColor = "text-emerald-600";
                      } else {
                        Icon = Bell;
                        bgColor = "bg-amber-100";
                        iconColor = "text-amber-600";
                      }
                      
                      // For notifications that are unread, add a highlight
                      const isUnread = activity.read === false;
                      
                      return (
                        <div 
                          key={`activity-${index}`} 
                          className={`flex items-center gap-4 rounded-md border border-light p-3 
                            hover:bg-lightest/30 transition-colors ${isUnread ? 'bg-blue-50' : ''}`}
                        >
                          <div className={`rounded-full ${bgColor} p-2`}>
                            <Icon className={`h-4 w-4 ${iconColor}`} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-darker">{activity.title}</p>
                            <p className="text-xs text-darker/70">{activity.description}</p>
                          </div>
                          <div className="text-xs text-darker/70">
                            <RelativeDate date={activity.date} />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center text-darker/70 py-4">No recent activity</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t border-light/50">
                <Link href="/dashboard/notifications" className="w-full mt-6">
                  <Button variant="outline" size="sm" className="w-full text-darker border-darker hover:bg-light hover:text-white transition-colors">View All Activity</Button>
                </Link>
              </CardFooter>
            </Card>
            <Card className="lg:col-span-3 border-0 shadow-md bg-white">
              <CardHeader className="bg-white rounded-t-lg border-b border-light/50 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-darker">Quick Actions</CardTitle>
                  <CardDescription className="text-darker/70">Commonly used features</CardDescription>
                </div>
                <Zap className="h-5 w-5 text-light" />
              </CardHeader>
              <CardContent className="space-y-2 pt-5 text-darker">
                <Link href="/job-hub" className="w-full block">
                  <Button variant="outline" className="w-full justify-between border-darker">
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2" />
                      <span>Browse Job Listings</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/workforce-hub" className="w-full block">
                  <Button variant="outline" className="w-full justify-between border-darker">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Find Collaborators</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard/profile" className="w-full block">
                  <Button variant="outline" className="w-full justify-between border-darker">
                    <div className="flex items-center">
                      <UserCircle className="h-4 w-4 mr-2" />
                      <span>Update Profile</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard/contracts" className="w-full block">
                  <Button variant="outline" className="w-full justify-between border-darker">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span>Manage Contracts</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Milestones from Contracts */}
          <Card className="border-0 shadow-md bg-white mb-6">
            <CardHeader className="bg-white rounded-t-lg border-b border-light/50 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-darker">Upcoming Milestones</CardTitle>
                <CardDescription className="text-darker/70">Deadlines from your active contracts</CardDescription>
              </div>
              <Calendar className="h-5 w-5 text-light" />
            </CardHeader>
            <CardContent className="pt-5">
              <div className="space-y-4">
                {upcomingMilestones && upcomingMilestones.length > 0 ? (
                  upcomingMilestones.map((milestone: any, index: number) => (
                    <div key={`milestone-${index}`} className="flex items-center gap-4 rounded-md border border-light p-4 hover:bg-lightest/30 transition-colors">
                      <div className="rounded-full bg-blue-100 p-2 hidden sm:flex">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-darker">{milestone.title}</p>
                        <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                          <p className="text-sm text-darker/70">{milestone.contractTitle}</p>
                          <p className="text-sm font-medium text-darker">
                            Due: <RelativeDate date={milestone.dueDate} />
                          </p>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-darker">{formatCurrency(milestone.amount, milestone.currency)}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-darker/70">No upcoming milestones</div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t border-light/50">
              <Link href="/dashboard/contracts" className="w-full mt-6">
                <Button variant="outline" size="sm" className="w-full text-darker border-darker transition-colors">Manage All Contracts</Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Notifications Feed */}
          <Card className="border-0 shadow-md bg-white">
            <CardHeader className="bg-white rounded-t-lg border-b border-light/50 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-darker">Recent Notifications</CardTitle>
                <CardDescription className="text-darker/70">Stay updated with the latest information</CardDescription>
              </div>
              <Badge className="bg-red-500 text-white">{stats.notifications.unread} new</Badge>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="space-y-4">
                {dashboardData.notifications && dashboardData.notifications.length > 0 ? (
                  dashboardData.notifications.map((notification: any, index: number) => {
                    // Select icon based on notification type
                    let Icon = Bell;
                    let bgColor = "bg-blue-100";
                    let iconColor = "text-blue-600";
                    
                    if (notification.type === 'application') {
                      Icon = Briefcase;
                      bgColor = "bg-blue-100";
                      iconColor = "text-blue-600";
                    } else if (notification.type === 'job') {
                      Icon = FileText;
                      bgColor = "bg-emerald-100";
                      iconColor = "text-emerald-600";
                    } else if (notification.type === 'contract') {
                      Icon = FileText;
                      bgColor = "bg-amber-100";
                      iconColor = "text-amber-600";
                    } else if (notification.type === 'payment') {
                      Icon = DollarSign;
                      bgColor = "bg-purple-100";
                      iconColor = "text-purple-600";
                    } else {
                      Icon = Bell;
                      bgColor = "bg-gray-100";
                      iconColor = "text-gray-600";
                    }
                    
                    // For unread notifications, add a highlight
                    const isUnread = !notification.read;
                    
                    return (
                      <div
                        key={`notification-${index}`}
                        className={`flex items-center gap-4 rounded-md border border-light p-3 hover:bg-lightest/30 transition-colors ${isUnread ? 'bg-blue-50' : ''}`}
                      >
                        <div className={`rounded-full ${bgColor} p-2`}>
                          <Icon className={`h-4 w-4 ${iconColor}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-darker">{notification.title}</p>
                          <p className="text-xs text-darker/70">{notification.message}</p>
                        </div>
                        <div className="text-xs text-darker/70">
                          <RelativeDate date={notification.createdAt} />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center py-4 text-darker/70">No notifications</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t border-light/50">
              <Link href="/dashboard/notifications" className="w-full mt-6">
                <Button variant="outline" size="sm" className="w-full text-darker border-darker transition-colors">
                  View All Notifications
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        <Footer/>
      </main>
    </div>
  );
}
