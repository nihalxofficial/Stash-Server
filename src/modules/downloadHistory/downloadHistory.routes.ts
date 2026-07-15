// src/modules/downloadHistory/downloadHistory.routes.ts
import { Router } from 'express';
import requireAuth from '../../middlewares/requireAuth';
import * as ctrl from './downloadHistory.controller';

const router = Router();

router.get('/me', ctrl.getMyHistory); 

export default router;