import { Schema, model, Document, Types } from 'mongoose';

export interface ICategory extends Document {
  userId: Types.ObjectId;
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  color: { type: String, required: false, default: '#FFFFFF' }, // Default color if not provided
}, { timestamps: true });

export const Category = model<ICategory>('Category', categorySchema);
