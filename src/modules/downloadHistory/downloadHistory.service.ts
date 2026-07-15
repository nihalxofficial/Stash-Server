// src/modules/downloadHistory/downloadHistory.service.ts
import * as historyRepo from './downloadHistory.repository';

export const recordDownload = (userId: string, gameId: string) => {
  return historyRepo.create({ user: userId, game: gameId });
};

export const getHistoryForUser = (userId: string) => {
  return historyRepo.findByUser(userId);
};