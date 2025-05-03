import mongoose, { Schema, Document } from 'mongoose';

// Define the notification interface with TypeScript
export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'application' | 'job' | 'message' | 'system' | 'contract' | 'payment';
  read: boolean;
  relatedId?: mongoose.Types.ObjectId; // ID of related entity (job, application, etc.)
  createdAt: Date;
}

// Create the schema with validation and options
const NotificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['application', 'job', 'message', 'system', 'contract', 'payment'],
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    relatedId: {
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Create index on userId and read status for efficient queries
NotificationSchema.index({ userId: 1, read: 1 });

// Prevent model recompilation when the file is imported multiple times
export const Notification = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);