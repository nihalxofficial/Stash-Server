import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IGame extends Document {
  title: string;
  slug: string;
  thumbnail: string;
  images: string[];
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
  owner: Types.ObjectId;
}

const gameSchema = new Schema<IGame>({
  title: String,
  slug: String,
  thumbnail: String,
  images: [String],
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
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Game = mongoose.model<IGame>('Game', gameSchema);

export default Game;