// src/modules/user/user.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role?: string;
  status?: string;
  plan?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  name: String,
  email: String,
  emailVerified: Boolean,
  image: String,
  role: String,
  status: String,
  plan: String
}, { timestamps: true, collection: 'user' });
export default mongoose.model<IUser>('User', userSchema);