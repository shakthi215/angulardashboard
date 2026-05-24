import mongoose, { Document, Schema } from 'mongoose';

export type RecordStatus = 'Active' | 'Pending' | 'Resolved' | 'Closed';
export type RecordPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type RecordAccessLevel = 'Public' | 'Restricted' | 'Confidential';

export interface IRecord extends Document {
  recordId: string;
  title: string;
  description: string;
  status: RecordStatus;
  priority: RecordPriority;
  accessLevel: RecordAccessLevel;
  assignedTo: string;
  category: string;
  tags: string[];
  dueDate: Date;
  completionPercentage: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const recordSchema = new Schema<IRecord>(
  {
    recordId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Pending', 'Resolved', 'Closed'],
      default: 'Pending',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    accessLevel: {
      type: String,
      enum: ['Public', 'Restricted', 'Confidential'],
      default: 'Public',
    },
    assignedTo: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    tags: [{ type: String }],
    dueDate: {
      type: Date,
      required: true,
    },
    completionPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Record = mongoose.model<IRecord>('Record', recordSchema);
