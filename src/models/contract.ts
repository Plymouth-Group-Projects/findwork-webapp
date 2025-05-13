import mongoose, { Schema, Document } from 'mongoose';

// Define the contract interface with TypeScript
export interface IContract extends Document {
  title: string;
  description: string;
  clientId: mongoose.Types.ObjectId;
  freelancerId: mongoose.Types.ObjectId;
  jobId?: mongoose.Types.ObjectId; // Optional if contract is created from a job posting
  startDate: Date;
  endDate?: Date;
  paymentTerms: string;
  paymentAmount: number;
  currency: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled' | 'disputed';
  milestones?: {
    title: string;
    description: string;
    dueDate: Date;
    amount: number;
    status: 'pending' | 'completed' | 'cancelled';
  }[];
  attachments?: string[]; // URLs to attachment files
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema with validation and options
const ContractSchema = new Schema<IContract>(
  {
    title: {
      type: String,
      required: [true, 'Contract title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Contract description is required'],
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    freelancerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
    },
    paymentTerms: {
      type: String,
      required: [true, 'Payment terms are required'],
    },
    paymentAmount: {
      type: Number,
      required: [true, 'Payment amount is required'],
    },    currency: {
      type: String,
      default: 'LKR',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'completed', 'cancelled', 'disputed'],
      default: 'pending',
    },
    milestones: [
      {
        title: { type: String, required: true },
        description: { type: String },
        dueDate: { type: Date, required: true },
        amount: { type: Number, required: true },
        status: {
          type: String,
          enum: ['pending', 'completed', 'cancelled'],
          default: 'pending',
        },
      },
    ],
    attachments: [
      {
        type: String, // URLs to attachment files
      },
    ],
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

// Create indexes for efficient querying
ContractSchema.index({ clientId: 1 });
ContractSchema.index({ freelancerId: 1 });
ContractSchema.index({ status: 1 });

// Prevent model recompilation when the file is imported multiple times
export const Contract = mongoose.models.Contract || mongoose.model<IContract>('Contract', ContractSchema);