// src/modules/user/user.repository.ts
import User from './user.model';

export const findAll = () => User.find();
export const findById = (id: string) => User.findById(id);