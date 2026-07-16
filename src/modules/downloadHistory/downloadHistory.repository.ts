// src/modules/downloadHistory/downloadHistory.repository.ts
import DownloadHistory from './downloadHistory.model';

export const create = (data: any) => DownloadHistory.create(data);

export const findByUser = (userId: string) =>
  DownloadHistory.find({ user: userId })
    .populate('game', 'title thumbnail price')
    .sort({ downloadedAt: -1 });