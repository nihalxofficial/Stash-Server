import { Router } from 'express';
import upload from '../../middlewares/upload';
import requireAuth from '../../middlewares/requireAuth';
import * as ctrl from './game.controller';

const router = Router();

router.get('/', ctrl.search);
router.get('/:id', ctrl.getOne);
router.get('/:id/download', ctrl.download);
router.post('/', requireAuth, upload.single('file'), ctrl.create);
router.patch('/:id', requireAuth, ctrl.update);
router.delete('/:id', requireAuth, ctrl.remove);

export default router;