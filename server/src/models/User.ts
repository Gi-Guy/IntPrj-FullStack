import { createHash } from 'crypto';
import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
  email: string;
  password: string;
  fullName: string;
  createdAt: Date;
  isSamePassword: (password: string) => boolean;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
    set(this: IUser, newPassword: string) {
      if (!this.createdAt) {
        throw new Error('createdAt must be set before setting password');
      }
      return hashPasswordWithSalt(newPassword, this.createdAt);
    },
  },
  fullName: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

userSchema.methods.isSamePassword = function (this: IUser, password: string): boolean {
  const hash = hashPasswordWithSalt(password, this.createdAt);
  return this.password === hash;
};

function hashPasswordWithSalt(password: string, salt: Date): string {
  const hash = createHash('sha512');
  hash.update(password);
  hash.update(salt.valueOf().toString());
  return hash.digest('hex');
}

export const User = model<IUser>('User', userSchema);
