// src/modules/game/game.controller.ts
import { Request, Response } from 'express';
import * as gameService from './game.service';
import asyncHandler from '../../utils/asyncHandler';
import { success, message } from '../../utils/apiResponse';

export const create = asyncHandler(async (req: Request, res: Response) => {
  const file = req.file as Express.Multer.File;
  if (!file) throw new Error('Game file is required');

  const game = await gameService.createGame({
    ...req.body,                    // title, slug, thumbnail, genre, platform, etc.
    fileName: file.filename,
    originalName: file.originalname,
    filePath: file.path,
    owner: req.user!.id,
  });
  success(res, game, 201);
});

export const search = asyncHandler(async (req: Request, res: Response) => {
  const { q, genre, platform } = req.query as { q?: string; genre?: string; platform?: string };
  const games = await gameService.findGames(q, genre, platform);
  success(res, games);
});

export const download = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const game = await gameService.getGameFile(id);
  res.download(game.filePath, game.originalName);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await gameService.deleteGame(id);
  message(res, 'Game deleted');
});