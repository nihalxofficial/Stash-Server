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
  status: string;
  price: number;
  size: string;
  fileName: string;
  originalName: string;
  filePath: string;
  owner: string;
}

const gameSchema = new Schema<IGame>({
  title: String,
  slug: String,
  thumbnail: String,
  description: String,
  genre: [String],
  rating: { type: Number, default: 0 },
  releaseDate: String,
  platform: [String],
  status: { type: String, default: 'Live' },
  price: { type: Number, default: 0 },
  size: String,
  fileName: String,
  originalName: String,
  filePath: String,
  owner: String,
}, { timestamps: true });

const Game = mongoose.model<IGame>('Game', gameSchema);

export default Game;