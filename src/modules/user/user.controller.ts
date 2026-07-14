// src/modules/user/user.controller.ts
import { Request, Response } from 'express';
import * as userService from './user.service';
import asyncHandler from '../../utils/asyncHandler';
import { success } from '../../utils/apiResponse';

export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  success(res, users);
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const user = await userService.getUserById(id);
  success(res, user);
});