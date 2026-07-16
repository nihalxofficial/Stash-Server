// src/modules/downloadHistory/downloadHistory.controller.ts
import { Request, Response } from 'express';
import * as historyService from './downloadHistory.service';

export const getMyHistory = async (req: Request, res: Response) => {
  const { userId } = req.query;
  const history = await historyService.getHistoryForUser(userId as string);
  res.send(history);
};