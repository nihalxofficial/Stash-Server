import * as gameRepo from './game.repository';

export const createGame = (data: any) => {
  return gameRepo.create(data);
};

export const searchGames = (reqQuery: any) => {
  const query: any = {};

  if (reqQuery.q) {
    query.title = { $regex: reqQuery.q, $options: 'i' };
  }
  if (reqQuery.genre) {
    query.genre = reqQuery.genre;
  }
  if (reqQuery.platform) {
    query.platform = reqQuery.platform;
  }
  if (reqQuery.status) {
    query.status = reqQuery.status;
  }

  return gameRepo.findAll(query);
};

export const getGameById = (id: string) => {
  return gameRepo.findById(id);
};

export const updateGame = (id: string, data: any) => {
  return gameRepo.updateById(id, data);
};

export const deleteGame = (id: string) => {
  return gameRepo.deleteById(id);
};