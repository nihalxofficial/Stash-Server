// src/routes/index.ts
import { Router } from 'express';
import userRoutes from '../modules/user/user.routes';
import gameRoutes from '../modules/game/game.routes';
import downloadHistoryRoutes from '../modules/downloadHistory/downloadHistory.routes';

const router = Router();
router.use('/users', userRoutes);
router.use('/games', gameRoutes);
router.use('/download-history', downloadHistoryRoutes);


export default router;