// src/modules/user/user.routes.ts
import { Router } from 'express';
import * as ctrl from './user.controller';

const router = Router();
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);

export default router;