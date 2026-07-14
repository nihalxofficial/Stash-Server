// src/modules/game/game.routes.ts
import { Router } from 'express';
import upload from '../../middlewares/upload';
import requireAuth from '../../middlewares/requireAuth';
import * as ctrl from './game.controller';

const router = Router();
router.get('/search', ctrl.search);
router.get('/:id/download', ctrl.download);
router.post('/', requireAuth, upload.single('file'), ctrl.create);
router.delete('/:id', requireAuth, ctrl.remove);

export default router;