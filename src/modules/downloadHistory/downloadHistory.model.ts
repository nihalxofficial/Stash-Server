// src/modules/downloadHistory/downloadHistory.model.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IDownloadHistory extends Document {
  user: Types.ObjectId;
  game: Types.ObjectId;
  downloadedAt: Date;
}

const downloadHistorySchema = new Schema<IDownloadHistory>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  game: { type: Schema.Types.ObjectId, ref: 'Game', required: true },
  downloadedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const DownloadHistory = mongoose.model<IDownloadHistory>('DownloadHistory', downloadHistorySchema);

export default DownloadHistory;