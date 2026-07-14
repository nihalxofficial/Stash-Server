// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  status?: number;
}

const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  console.error(err.message);
  res.status(err.status || 500).json({ success: false, message: err.message });
};

export default errorHandler;