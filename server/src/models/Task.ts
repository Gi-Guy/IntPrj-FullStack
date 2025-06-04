import { Schema, model, Document, Types } from 'mongoose';

interface ITask extends Document {
  userId: Types.ObjectId;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'done'],
    default: 'todo',
  },
  dueDate: Date,
}, {
  timestamps: true,
});

export const Task = model<ITask>('Task', taskSchema);