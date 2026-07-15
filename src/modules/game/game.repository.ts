// src/modules/game/game.repository.ts
import Game from './game.model';

export const create = (data: any) => Game.create(data);

// Accept skip and limit arguments to build database boundaries
export const findAll = (query: any, sortOptions: any = {}, skip: number = 0, limit: number = 10) => {
  return Game.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);
};

export const countAll = (query: any) => {
  return Game.countDocuments(query);
};

export const findById = (id: string) => Game.findById(id).populate('owner', 'name email image');
export const updateById = (id: string, data: any) => Game.updateOne({ _id: id }, { $set: data });
export const deleteById = (id: string) => Game.deleteOne({ _id: id });

export const incrementDownloadCount = (id: string) =>
  Game.updateOne({ _id: id }, { $inc: { downloadCount: 1 } });