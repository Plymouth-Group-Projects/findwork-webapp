"use client"

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

// UI Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertTriangle,
  Bell,
  Briefcase,
  Calendar,
  Check,
  DollarSign,
  FileText,
  Filter,
  Trash2,
  X
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { useNotifications } from "@/hooks/use-notifications";
import Footer from "@/components/footer";

// Define notification interface
interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'application' | 'job' | 'message' | 'system' | 'contract' | 'payment';
  read: boolean;
  relatedId?: string;
  createdAt: string;
}

// Placeholder notifications when API hasn't returned data or fails
const placeholderNotifications: Notification[] = [
  {
    _id: 'placeholder-1',
    title: 'Job application received',
    message: 'Your application for "Senior Frontend Developer" has been received and is under review. The hiring manager will contact you within 5-7 business days.',
    type: 'application',
    read: false,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'placeholder-2',
    title: 'New message from client',
    message: 'You have received a new message regarding the "Website Redesign" project. The client has asked for a project status update and timeline revision.',
    type: 'message',
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    _id: 'placeholder-3',
    title: 'Payment received',
    message: 'Payment of $750 for "Logo Design" project has been processed successfully. The funds should appear in your account within 2-3 business days.',
    type: 'payment',
    read: false,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() // 2 days ago
  },
  {
    _id: 'placeholder-4',
    title: 'Contract proposal',
    message: 'You have received a contract proposal for the "Mobile App Development" project. Please review the terms and respond within 7 days.',
    type: 'contract',
    read: false,
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString() // 3 days ago
  },
  {
    _id: 'placeholder-5',
    title: 'New job opportunity',
    message: 'A new job matching your skills has been posted: "UI/UX Designer for E-commerce Platform". Apply now to be considered for this position.',
    type: 'job',
    read: true,
    createdAt: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString() // 4 days ago
  }
];

// Format relative date
const RelativeDate = ({ date }: { date: Date | string }) => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return <>{formatDistanceToNow(dateObj, { addSuffix: true })}</>;
  } catch (error) {
    return <>recently</>;
  }
};

export default function NotificationsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // State for selections
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isMarkingAsRead, setIsMarkingAsRead] = useState(false);
  const [showPlaceholders, setShowPlaceholders] = useState(false);
  
  // Use our custom hook for notifications
  const {
    notifications,
    unreadCount,
    loading,
    page,
    totalPages,
    setPage,
    fetchNotifications,
    markAsRead: markNotificationsAsRead,
    markAllAsRead
  } = useNotifications({ limit: 10 });

  // Check authentication and redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/dashboard/notifications");
    }
  }, [status, router]);
  // Refetch when tab changes
  useEffect(() => {
    if (status === "authenticated") {
      const unreadOnly = activeTab === "unread";
      fetchNotifications(1, unreadOnly);
    }
  }, [activeTab, fetchNotifications, status]);
  
  // Set placeholders when there are no notifications or on error
  useEffect(() => {
    if (!loading && notifications.length === 0) {
      setShowPlaceholders(true);
    } else {
      setShowPlaceholders(false);
    }
  }, [notifications, loading]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setPage(1); // Reset to first page when changing tabs
    setSelectedNotifications([]); // Clear selections
  };

  // Handle notification selection
  const toggleNotificationSelection = (id: string) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(notifId => notifId !== id)
        : [...prev, id]
    );
  };

  // Mark notifications as read
  const handleMarkAsRead = async () => {
    if (selectedNotifications.length === 0) return;
    
    try {
      setIsMarkingAsRead(true);
      
      // Use our hook's markAsRead function
      await markNotificationsAsRead(selectedNotifications);
      
      // Clear selected notifications
      setSelectedNotifications([]);
      
      toast({
        title: "Success",
        description: "Notifications marked as read.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark notifications as read. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsMarkingAsRead(false);
    }
  };
    // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      setIsMarkingAsRead(true);
      await markAllAsRead();
      setSelectedNotifications([]);
    } catch (error) {
      console.error("Error marking all as read:", error);
    } finally {
      setIsMarkingAsRead(false);
    }
  };
  
  // Determine which notifications to display (real or placeholders)
  const displayedNotifications = showPlaceholders 
    ? placeholderNotifications.filter(notif => activeTab !== 'unread' || !notif.read) 
    : notifications;

  // Calculate display unread count (from real notifications or placeholders)
  const displayedUnreadCount = showPlaceholders 
    ? placeholderNotifications.filter(notif => !notif.read).length 
    : unreadCount;

  // Render loading state
  if (status === "loading") {
    return (
      <div className="container px-4 mx-auto py-10 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 mt-24 overflow-auto">
      <div className="container px-4 mx-auto py-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
            <p className="text-white/70">Stay updated on your job applications, contracts, and more</p>
          </div>          {displayedUnreadCount > 0 && (
            <Badge className="bg-red-500 text-white py-1 px-3 text-sm">
              {displayedUnreadCount} unread
            </Badge>
          )}
        </div>
        
        <Card className="border-0 shadow-md bg-white">
          <CardHeader className="border-b border-gray-100 pb-4">
            <div className="flex items-center justify-between">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full max-w-md">
                <TabsList className="bg-white/60 border border-gray-100">
                  <TabsTrigger value="all" className="data-[state=active]:bg-light text-darker data-[state=active]:text-white">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="unread" className="data-[state=active]:bg-light text-darker data-[state=active]:text-white">
                    Unread
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              {selectedNotifications.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-darker/70">
                    {selectedNotifications.length} selected
                  </span>                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-light text-light hover:text-white hover:bg-light"
                    disabled={isMarkingAsRead}
                    onClick={handleMarkAsRead}
                  >
                    <Check className="h-4 w-4 mr-1" /> Mark as read
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setSelectedNotifications([])}
                    className="text-darker/70"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-start gap-4 p-3 rounded-md border border-gray-100">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-full" />
                      <div className="flex justify-between">
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>            
              ) : displayedNotifications.length > 0 ? (
              <div className="space-y-3">
                {displayedNotifications.map((notification) => {
                  // Select icon and color based on notification type
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
                  } else if (notification.type === 'message') {
                    Icon = Calendar;
                    bgColor = "bg-green-100";
                    iconColor = "text-green-600";
                  } else {
                    Icon = Bell;
                    bgColor = "bg-gray-100";
                    iconColor = "text-gray-600";
                  }
                  
                  return (
                    <div 
                      key={notification._id}
                      className={`flex items-center gap-4 rounded-md border p-4 
                        hover:bg-lightest/30 cursor-pointer transition-all
                        ${notification.read ? 'border-gray-100' : 'border-light/30 bg-blue-50'}`}
                      onClick={() => toggleNotificationSelection(notification._id)}
                    >
                      <div className={`h-5 w-5 rounded ${selectedNotifications.includes(notification._id) ? 'bg-light' : 'border border-gray-300'} flex items-center justify-center`}>
                        {selectedNotifications.includes(notification._id) && <Check className="h-3 w-3 text-white" />}
                      </div>
                      
                      <div className={`rounded-full ${bgColor} p-2`}>
                        <Icon className={`h-5 w-5 ${iconColor}`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h4 className={`font-medium ${notification.read ? 'text-darker' : 'text-darker'}`}>
                            {notification.title}
                          </h4>
                          <span className="text-xs text-darker/70 whitespace-nowrap ml-2">
                            <RelativeDate date={notification.createdAt} />
                          </span>
                        </div>
                        <p className="text-sm text-darker/70 mt-1">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10">
                <Bell className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <h3 className="text-lg font-medium text-darker mb-1">No notifications</h3>
                <p className="text-darker/70">
                  {activeTab === 'all' 
                    ? 'You don\'t have any notifications yet.' 
                    : 'You have read all your notifications.'}
                </p>
              </div>
            )}
          </CardContent>
          
          {!loading && !showPlaceholders && totalPages > 1 && (
            <CardFooter className="border-t border-gray-100 pt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setPage(prev => Math.max(1, prev - 1))}
                      className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink 
                        onClick={() => setPage(i + 1)}
                        isActive={page === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                      className={page >= totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardFooter>
          )}
        </Card>
      </div>
      <div className='mt-10'>
        <Footer />
      </div>
    </main>
  );
}
