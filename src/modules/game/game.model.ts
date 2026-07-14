// src/modules/game/game.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IGame extends Document {
  title: string;
  slug: string;
  thumbnail: string;
  description?: string;
  genre: string[];
  rating: number;
  releaseDate: string;
  platform: string[];
  status: 'Live' | 'Coming Soon' | 'Delisted';
  price: number;
  size: string;
  fileName: string;
  originalName: string;
  filePath: string;
  owner: string;
  createdAt: Date;
  updatedAt: Date;
}

const gameSchema = new Schema<IGame>({
  title:        { type: String, required: true },
  slug:         { type: String, required: true, unique: true },
  thumbnail:    { type: String, required: true },
  description:  { type: String },
  genre:        [{ type: String, index: true }],
  rating:       { type: Number, default: 0, min: 0, max: 5 },
  releaseDate:  { type: String },
  platform:     [{ type: String }],
  status:       { type: String, enum: ['Live', 'Coming Soon', 'Delisted'], default: 'Live' },
  price:        { type: Number, default: 0 },
  size:         { type: String },
  fileName:     { type: String, required: true },
  originalName: { type: String, required: true },
  filePath:     { type: String, required: true },
  owner:        { type: String, required: true },
}, { timestamps: true });

gameSchema.index({ title: 'text', description: 'text' });

export default mongoose.model<IGame>('Game', gameSchema);