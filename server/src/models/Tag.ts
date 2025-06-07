import { Schema, model, Document, Types } from 'mongoose';

export interface ITag extends Document {
  userId: Types.ObjectId;
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

const tagSchema = new Schema<ITag>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  color: { type: String, required: true },
}, { timestamps: true });

export const Tag = model<ITag>('Tag', tagSchema);
