// src/modules/downloadHistory/downloadHistory.controller.ts
import { Request, Response } from 'express';
import * as historyService from './downloadHistory.service';

export const getMyHistory = async (req: Request, res: Response) => {
  const history = await historyService.getHistoryForUser(req.user!.id);
  res.send(history);
};