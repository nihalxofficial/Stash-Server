import * as gameRepo from './game.repository';

export const createGame = (data: any) => {
  return gameRepo.create(data);
};


export const searchGames = async (reqQuery: any) => {
  const query: any = {};
  let sortOptions: any = {};

  // 1. Multi-Field Text Search Scanning Engine ($or Operator)
  if (reqQuery.q) {
    const searchRegex = { $regex: reqQuery.q, $options: 'i' };
    
    query.$or = [
      { title: searchRegex },
      { genre: searchRegex },    // MongoDB automatically checks all elements in the array
      { platform: searchRegex } // MongoDB automatically checks all elements in the array
    ];
  }

  // 2. Strict Category Filtering (Dropdown Selections)
  // Keeps separate strict dropdown filters active alongside the text query input
  if (reqQuery.genre) {
    query.genre = reqQuery.genre;
  }
  if (reqQuery.platform) {
    query.platform = reqQuery.platform;
  }

  // 3. Sorting Vector Evaluation
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

  // 4. Pagination Math Execution
  const page = Math.max(1, parseInt(reqQuery.page) || 1);
  const limit = Math.max(1, parseInt(reqQuery.limit) || 10);
  const skip = (page - 1) * limit;

  // Execute database repository actions
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