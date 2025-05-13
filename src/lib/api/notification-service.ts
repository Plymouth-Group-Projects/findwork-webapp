import mongoose from 'mongoose';
import { Notification } from '@/models/notification';
import { ConnectToDatabase } from '@/lib/mongoose';

export type NotificationType = 'application' | 'job' | 'message' | 'system' | 'contract' | 'payment';

// Service for creating and managing notifications
export class NotificationService {
  
  /**
   * Create a new notification for a specific user
   */
  static async createNotification({
    userId,
    title,
    message,
    type,
    relatedId,
  }: {
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    relatedId?: string;
  }) {
    try {
      await ConnectToDatabase();
      
      const notification = new Notification({
        userId: new mongoose.Types.ObjectId(userId),
        title,
        message,
        type,
        read: false,
        ...(relatedId && { relatedId: new mongoose.Types.ObjectId(relatedId) }),
      });
      
      await notification.save();
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw new Error('Failed to create notification');
    }
  }
  
  /**
   * Create notifications for multiple users at once (for group notifications)
   */
  static async createNotificationForMultipleUsers({
    userIds,
    title,
    message,
    type,
    relatedId,
  }: {
    userIds: string[];
    title: string;
    message: string;
    type: NotificationType;
    relatedId?: string;
  }) {
    try {
      await ConnectToDatabase();
      
      const notifications = userIds.map(userId => ({
        userId: new mongoose.Types.ObjectId(userId),
        title,
        message,
        type,
        read: false,
        ...(relatedId && { relatedId: new mongoose.Types.ObjectId(relatedId) }),
      }));
      
      await Notification.insertMany(notifications);
      return notifications;
    } catch (error) {
      console.error('Error creating multiple notifications:', error);
      throw new Error('Failed to create notifications for multiple users');
    }
  }
  
  /**
   * Mark specific notifications as read
   */
  static async markNotificationsAsRead({
    userId,
    notificationIds,
  }: {
    userId: string;
    notificationIds: string[];
  }) {
    try {
      await ConnectToDatabase();
      
      const objectIds = notificationIds.map(id => new mongoose.Types.ObjectId(id));
      
      const result = await Notification.updateMany(
        {
          _id: { $in: objectIds },
          userId: new mongoose.Types.ObjectId(userId),
        },
        { $set: { read: true } }
      );
      
      return {
        success: true,
        modifiedCount: result.modifiedCount,
      };
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      throw new Error('Failed to mark notifications as read');
    }
  }
  
  /**
   * Mark all notifications for a user as read
   */
  static async markAllNotificationsAsRead(userId: string) {
    try {
      await ConnectToDatabase();
      
      const result = await Notification.updateMany(
        { userId: new mongoose.Types.ObjectId(userId), read: false },
        { $set: { read: true } }
      );
      
      return {
        success: true,
        modifiedCount: result.modifiedCount,
      };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw new Error('Failed to mark all notifications as read');
    }
  }
  
  /**
   * Get user unread notification count
   */
  static async getUnreadCount(userId: string) {
    try {
      await ConnectToDatabase();
      
      const count = await Notification.countDocuments({
        userId: new mongoose.Types.ObjectId(userId),
        read: false,
      });
      
      return count;
    } catch (error) {
      console.error('Error getting unread notification count:', error);
      throw new Error('Failed to get unread notification count');
    }
  }
  
  /**
   * Delete a notification (admin only)
   */
  static async deleteNotification(notificationId: string) {
    try {
      await ConnectToDatabase();
      
      await Notification.findByIdAndDelete(notificationId);
      
      return {
        success: true,
        message: 'Notification deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw new Error('Failed to delete notification');
    }
  }
}
