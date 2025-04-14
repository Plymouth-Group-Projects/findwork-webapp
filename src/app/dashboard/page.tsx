import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { LogoutButton } from '@/components/auth/logout-button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Search,
  FileText,
  MessageSquare,
  UserCircle,
  FileSpreadsheet,
  Menu
} from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  // Protect the dashboard page
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-background p-6 shrink-0">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">FindWork</h2>
        </div>
        
        <nav className="space-y-1 flex-1">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium bg-secondary"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link 
            href="/jobs" 
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary/50 transition-colors"
          >
            <Search className="h-4 w-4" />
            Job Search
          </Link>
          <Link 
            href="/applications" 
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary/50 transition-colors"
          >
            <FileText className="h-4 w-4" />
            Applications
          </Link>
          <Link 
            href="/interviews" 
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary/50 transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            Interviews
          </Link>
          <Link 
            href="/profile" 
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary/50 transition-colors"
          >
            <UserCircle className="h-4 w-4" />
            Profile
          </Link>
          <Link 
            href="/resume" 
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary/50 transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Resume
          </Link>
        </nav>
        
        <div className="mt-auto pt-4 border-t">
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="flex-1">
              <p className="text-sm font-medium truncate">{session.user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Mobile Sidebar (Sheet from Shadcn UI) */}
      <Sheet>
        <SheetTrigger asChild className="md:hidden fixed bottom-4 right-4 z-10">
          <Button size="icon" className="rounded-full w-12 h-12">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-8">FindWork</h2>
              
              <nav className="space-y-1">
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium bg-secondary"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link 
                  href="/jobs" 
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary/50 transition-colors"
                >
                  <Search className="h-4 w-4" />
                  Job Search
                </Link>
                <Link 
                  href="/applications" 
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary/50 transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  Applications
                </Link>
                <Link 
                  href="/interviews" 
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary/50 transition-colors"
                >
                  <MessageSquare className="h-4 w-4" />
                  Interviews
                </Link>
                <Link 
                  href="/profile" 
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary/50 transition-colors"
                >
                  <UserCircle className="h-4 w-4" />
                  Profile
                </Link>
                <Link 
                  href="/resume" 
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary/50 transition-colors"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Resume
                </Link>
              </nav>
            </div>
            
            <div className="mt-auto p-6 border-t">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1">
                  <p className="text-sm font-medium truncate">{session.user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                </div>
              </div>
              <LogoutButton/>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto py-10">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="md:hidden">
              <LogoutButton />
            </div>
          </div>
          
          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2.5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Interviews Scheduled</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">+1 from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Job Offers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-muted-foreground">New this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">+20% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity and Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mb-6">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your activity from the past 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Activity items */}
                  <div className="flex items-center gap-4 rounded-md border p-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium">Job Application Submitted</p>
                      <p className="text-xs text-muted-foreground">Frontend Developer at TechCorp</p>
                    </div>
                    <div className="text-xs text-muted-foreground">2 days ago</div>
                  </div>
                  <div className="flex items-center gap-4 rounded-md border p-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium">Interview Scheduled</p>
                      <p className="text-xs text-muted-foreground">Software Engineer at DevInc</p>
                    </div>
                    <div className="text-xs text-muted-foreground">3 days ago</div>
                  </div>
                  <div className="flex items-center gap-4 rounded-md border p-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium">Profile Updated</p>
                      <p className="text-xs text-muted-foreground">Added new skills and projects</p>
                    </div>
                    <div className="text-xs text-muted-foreground">5 days ago</div>
                  </div>
                  </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">View All Activity</Button>
              </CardFooter>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Commonly used features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start">Search Jobs</Button>
                <Button className="w-full justify-start" variant="outline">Update Profile</Button>
                <Button className="w-full justify-start" variant="outline">Create Resume</Button>
                <Button className="w-full justify-start" variant="outline">Browse Companies</Button>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Interviews */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Interviews</CardTitle>
              <CardDescription>Your scheduled interviews for the next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-md border p-4">
                  <div className="flex-1">
                    <p className="font-medium">DevInc - Software Engineer</p>
                    <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                      <p className="text-sm text-muted-foreground">Technical Interview • 45 minutes</p>
                      <p className="text-sm font-medium">Tomorrow, 2:00 PM</p>
                    </div>
                  </div>
                  <Button size="sm">Prepare</Button>
                </div>
                <div className="flex items-center gap-4 rounded-md border p-4">
                  <div className="flex-1">
                    <p className="font-medium">WebSoft - Frontend Developer</p>
                    <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                      <p className="text-sm text-muted-foreground">Initial Screening • 30 minutes</p>
                      <p className="text-sm font-medium">Friday, 11:00 AM</p>
                    </div>
                  </div>
                  <Button size="sm">Prepare</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">Manage All Interviews</Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
