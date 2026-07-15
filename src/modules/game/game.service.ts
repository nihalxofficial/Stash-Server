import * as gameRepo from './game.repository';

export const createGame = (data: any) => {
  return gameRepo.create(data);
};

// src/modules/game/game.service.ts

export const searchGames = async (reqQuery: any) => {
  const query: any = {};
  let sortOptions: any = {};

  // 1. Text Search & Array Selection Operations
  if (reqQuery.q) {
    query.title = { $regex: reqQuery.q, $options: 'i' };
  }
  if (reqQuery.genre) {
    query.genre = reqQuery.genre;
  }

  // 2. Sorting Vector Evaluation
  if (reqQuery.sortBy) {
    switch (reqQuery.sortBy) {
      case 'title': sortOptions.title = 1; break;
      case 'rating': sortOptions.rating = -1; break;
      case 'price-low': sortOptions.price = 1; break;
      case 'price-high': sortOptions.price = -1; break;
      default: sortOptions.createdAt = -1;
    }
  } else {
    sortOptions.createdAt = -1;
  }

  // 3. Pagination Math Execution
  const page = Math.max(1, parseInt(reqQuery.page) || 1);
  const limit = Math.max(1, parseInt(reqQuery.limit) || 8);
  const skip = (page - 1) * limit;

  // Run database lookups simultaneously to save execution time
  const [games, totalItems] = await Promise.all([
    gameRepo.findAll(query, sortOptions, skip, limit),
    gameRepo.countAll(query)
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  return {
    games,
    meta: {
      totalItems,
      totalPages,
      page,
      limit
    }
  };
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