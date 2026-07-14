import { Request, Response } from 'express';
import * as gameService from './game.service';

export const create = async (req: Request, res: Response) => {
  const file = req.file as Express.Multer.File;
  if (!file) return res.status(400).send({ message: 'File is required' });

  const data = req.body;

  const result = await gameService.createGame({
    ...data,
    genre: Array.isArray(data.genre) ? data.genre : [data.genre],
    platform: Array.isArray(data.platform) ? data.platform : [data.platform],
    fileName: file.filename,
    originalName: file.originalname,
    filePath: file.path,
    owner: req.user!.id,
  });

  res.send(result);
};

export const search = async (req: Request, res: Response) => {
  const games = await gameService.searchGames(req.query);
  res.send(games);
};

export const getOne = async (req: Request, res: Response) => {
  const { id } = req.params;
  const game = await gameService.getGameById(id as string);
  res.send(game);
};

export const download = async (req: Request, res: Response) => {
  const { id } = req.params;
  const game = await gameService.getGameById(id as string);
  if (!game) return res.status(404).send({ message: 'Game not found' });
  res.download(game.filePath, game.originalName);
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await gameService.updateGame(id as string, req.body);
  res.send(result);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await gameService.deleteGame(id as string);
  res.send(result);
};