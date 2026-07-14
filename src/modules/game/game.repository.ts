// src/modules/game/game.repository.ts
import Game, { IGame } from './game.model';

export const create = (data: Partial<IGame>) => Game.create(data);
export const findById = (id: string) => Game.findById(id);
export const findBySlug = (slug: string) => Game.findOne({ slug });
export const deleteById = (id: string) => Game.findByIdAndDelete(id);

export const search = (query?: string, genre?: string, platform?: string) => {
  const filter: Record<string, any> = {};
  if (query) filter.$text = { $search: query };
  if (genre) filter.genre = genre;
  if (platform) filter.platform = platform;
  return Game.find(filter);
};