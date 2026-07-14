// src/modules/game/game.service.ts
import fs from 'fs';
import * as gameRepo from './game.repository';
import { IGame } from './game.model';

export const createGame = (data: Partial<IGame>) => gameRepo.create(data);

export const findGames = (query?: string, genre?: string, platform?: string) =>
  gameRepo.search(query, genre, platform);

export const getGameFile = async (id: string) => {
  const game = await gameRepo.findById(id);
  if (!game) throw new Error('Game not found');
  if (!fs.existsSync(game.filePath)) throw new Error('File missing on server');
  return game;
};

export const deleteGame = async (id: string) => {
  const game = await gameRepo.findById(id);
  if (!game) throw new Error('Game not found');
  if (fs.existsSync(game.filePath)) fs.unlinkSync(game.filePath);
  return gameRepo.deleteById(id);
};