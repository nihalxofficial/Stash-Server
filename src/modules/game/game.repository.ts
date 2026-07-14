import Game from './game.model';

export const create = (data: any) => Game.create(data);
export const findAll = (query: any) => Game.find(query);
export const findById = (id: string) => Game.findById(id).populate('owner', 'name email');
export const updateById = (id: string, data: any) => Game.updateOne({ _id: id }, { $set: data });
export const deleteById = (id: string) => Game.deleteOne({ _id: id });