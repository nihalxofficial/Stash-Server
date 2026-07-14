// src/utils/apiResponse.ts
import { Response } from 'express';

export const success = (res: Response, data: unknown, status = 200) => {
  res.status(status).json({ success: true, data });
};

export const message = (res: Response, msg: string, status = 200) => {
  res.status(status).json({ success: true, message: msg });
};