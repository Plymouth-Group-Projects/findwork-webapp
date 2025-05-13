'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from '@/hooks/use-toast';

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'application' | 'job' | 'message' | 'system' | 'contract' | 'payment';
  read: boolean;
  relatedId?: string;
  createdAt: string;
}

interface NotificationResponse {
  notifications: Notification[];
  pagination: {
    total: number;
    unreadCount: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface UseNotificationsOptions {
  limit?: number;
  refreshInterval?: number | null;
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const { limit = 10, refreshInterval = 30000 } = options;
  const { data: session, status } = useSession();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch notifications
  const fetchNotifications = useCallback(async (pageNum = 1, unreadOnly = false) => {
    if (status !== 'authenticated') return;

    try {
      setLoading(true);
      
      let url = `/api/notifications?page=${pageNum}&limit=${limit}`;
      if (unreadOnly) {
        url += "&unread=true";
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      
      const data: NotificationResponse = await response.json();
      
      setNotifications(data.notifications);
      setUnreadCount(data.pagination.unreadCount);
      setTotalPages(data.pagination.totalPages);
      setError(null);
    } catch (e: any) {
      setError(e.message || 'An error occurred while fetching notifications');
      toast({
        title: 'Error',
        description: 'Failed to load notifications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [status, limit]);

  // Mark selected notifications as read
  const markAsRead = async (notificationIds: string[]) => {
    if (!notificationIds.length) return;

    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationIds,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark notifications as read');
      }

      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notificationIds.includes(notification._id)
            ? { ...notification, read: true }
            : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - notificationIds.length));
      
      return true;
    } catch (e) {
      console.error('Error marking notifications as read:', e);
      toast({
        title: 'Error',
        description: 'Failed to mark notifications as read',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }

      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      // Update unread count
      setUnreadCount(0);
      
      toast({
        title: 'Success',
        description: 'All notifications marked as read',
      });
      
      return true;
    } catch (e) {
      console.error('Error marking all notifications as read:', e);
      toast({
        title: 'Error',
        description: 'Failed to mark all notifications as read',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Get just the unread count
  const fetchUnreadCount = async () => {
    if (status !== 'authenticated') return;

    try {
      const response = await fetch('/api/notifications/unread-count');
      
      if (!response.ok) {
        throw new Error('Failed to fetch unread count');
      }
      
      const data = await response.json();
      setUnreadCount(data.count);
    } catch (e) {
      console.error('Error fetching unread count:', e);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (status === 'authenticated') {
      fetchNotifications(page);
    }
  }, [status, page, fetchNotifications]);

  // Set up auto-refresh if requested
  useEffect(() => {
    if (!refreshInterval || status !== 'authenticated') return;
    
    const intervalId = setInterval(() => {
      fetchUnreadCount();
    }, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [refreshInterval, status]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    page,
    totalPages,
    setPage,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    fetchUnreadCount,
  };
}
