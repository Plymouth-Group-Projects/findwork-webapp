'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

// Get relative date in human-readable format
const RelativeDate = ({ date }: { date: string | Date }) => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return <>{formatDistanceToNow(dateObj, { addSuffix: true })}</>;
  } catch (error) {
    return <>recently</>;
  }
};

// Placeholder notifications for when the API hasn't returned data or fails
const placeholderNotifications = [
  {
    _id: 'placeholder-1',
    title: 'Job application received',
    message: 'Your application for "Senior Frontend Developer" has been received and is under review.',
    type: 'application',
    read: false,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'placeholder-2',
    title: 'New message from client',
    message: 'You have received a new message regarding the "Website Redesign" project.',
    type: 'message',
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    _id: 'placeholder-3',
    title: 'Payment received',
    message: 'Payment of $750 for "Logo Design" project has been processed successfully.',
    type: 'payment',
    read: false,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() // 2 days ago
  },
  {
    _id: 'placeholder-4',
    title: 'Contract proposal',
    message: 'You have received a contract proposal for the "Mobile App Development" project.',
    type: 'contract',
    read: false,
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString() // 3 days ago
  },
  {
    _id: 'placeholder-5',
    title: 'New job opportunity',
    message: 'A new job matching your skills has been posted: "UI/UX Designer for E-commerce Platform"',
    type: 'job',
    read: true,
    createdAt: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString() // 4 days ago
  }
];

export function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [showPlaceholders, setShowPlaceholders] = useState(true);

  // Fetch notifications when the popover is opened
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/notifications?limit=5');
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.pagination.unreadCount);
        setShowPlaceholders(data.notifications.length === 0); // Only show placeholders if no real notifications
      } else {
        // Show placeholders if API fails
        setShowPlaceholders(true);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Show placeholders on error
      setShowPlaceholders(true);
    } finally {
      setLoading(false);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications/mark-all-read', {
        method: 'PATCH',
      });
      
      // Update UI state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  // Fetch unread count periodically
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch('/api/notifications/unread-count');
        
        if (response.ok) {
          const data = await response.json();
          setUnreadCount(data.count);
        } else {
          // Set placeholder count when API fails
          setUnreadCount(placeholderNotifications.filter(n => !n.read).length);
        }
      } catch (error) {
        console.error('Error fetching unread count:', error);
        // Set placeholder count on error
        setUnreadCount(placeholderNotifications.filter(n => !n.read).length);
      }
    };
    
    // Initial fetch
    fetchUnreadCount();
    
    // Set interval for periodic updates
    const intervalId = setInterval(fetchUnreadCount, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, []);

  // Display notifications or placeholders based on state
  const displayedNotifications = showPlaceholders ? placeholderNotifications : notifications;

  return (
    <Popover open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (isOpen) {
        fetchNotifications();
      }
    }}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -right-1 -top-1 h-4 min-w-4 p-0 flex items-center justify-center text-[10px] bg-red-500 text-white"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-3">
          <h4 className="font-medium">Notifications</h4>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs" 
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        <div className="max-h-80 overflow-auto">
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
          ) : displayedNotifications.length > 0 ? (
            displayedNotifications.map((notification) => {
              // Select icon color based on notification type
              let bgColor = "bg-blue-50";
              
              if (notification.type === 'application') {
                bgColor = "bg-blue-50";
              } else if (notification.type === 'job') {
                bgColor = "bg-emerald-50";
              } else if (notification.type === 'contract') {
                bgColor = "bg-amber-50";
              } else if (notification.type === 'payment') {
                bgColor = "bg-purple-50";
              } else if (notification.type === 'message') {
                bgColor = "bg-green-50";
              }
              
              // For unread notifications, add a highlight
              const isUnread = !notification.read;
              
              return (
                <Link 
                  href="/dashboard/notifications" 
                  key={notification._id}
                  className="block"
                  onClick={() => setOpen(false)}
                >
                  <div className={`border-b p-3 hover:bg-gray-50 ${isUnread ? bgColor : ''}`}>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{notification.title}</p>
                      {isUnread && <span className="h-2 w-2 rounded-full bg-red-500"></span>}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <RelativeDate date={notification.createdAt} />
                    </p>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          )}
        </div>
        
        <div className="border-t p-2">
          <Link 
            href="/dashboard/notifications"
            className="block w-full"
            onClick={() => setOpen(false)}
          >
            <Button variant="ghost" className="w-full justify-center text-xs">
              View all notifications
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
