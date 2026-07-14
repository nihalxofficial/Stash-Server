// src/modules/user/user.service.ts
import * as userRepo from './user.repository';

export const getAllUsers = () => userRepo.findAll();

export const getUserById = async (id: string) => {
  const user = await userRepo.findById(id);
  if (!user) throw new Error('User not found');
  return user;
};