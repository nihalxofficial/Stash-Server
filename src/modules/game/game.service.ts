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
      { genre: searchRegex },
      { platform: searchRegex }
    ];
  }

  // 2. Strict / Array Dropdown Filtering Elements
  if (reqQuery.owner) {
    query.owner = reqQuery.owner;
  }

  if (reqQuery.genre) {
    // Matches if the genre array contains this specific string (case-insensitive)
    query.genre = { $regex: new RegExp(`^${reqQuery.genre}$`, 'i') };
  }

  // FIXED/UPDATED: Platform dropdown handling for schema array configurations
  if (reqQuery.platform) {
    // Using a clean anchors regex to find matching array strings case-insensitively 
    // without suffering exact-match array order restrictions
    query.platform = { $regex: new RegExp(`^${reqQuery.platform}$`, 'i') };
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
  const limit = Math.max(1, parseInt(reqQuery.limit) || 8);
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

export const incrementDownloadCount = (id: string) => {
  return gameRepo.incrementDownloadCount(id);
};