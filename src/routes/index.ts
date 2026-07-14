// src/routes/index.ts
import { Router } from 'express';
import userRoutes from '../modules/user/user.routes';
import gameRoutes from '../modules/game/game.routes';

const router = Router();
router.use('/users', userRoutes);
router.use('/games', gameRoutes);

export default router;