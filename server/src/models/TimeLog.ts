import { Schema, model, Document, Types } from 'mongoose';

export interface ITimeLog extends Document {
  userId: Types.ObjectId;
  taskId: Types.ObjectId;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

const timeLogSchema = new Schema<ITimeLog>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
}, { timestamps: true });

export const TimeLog = model<ITimeLog>('TimeLog', timeLogSchema);
