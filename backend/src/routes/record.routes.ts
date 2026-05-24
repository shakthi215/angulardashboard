import { Router } from 'express';
import {
  getRecords,
  getRecordById,
  getDashboardStats,
} from '../controllers/record.controller';
import { authenticate } from '../middleware/auth.middleware';
import { delayMiddleware } from '../middleware/delay.middleware';

const router = Router();

router.use(authenticate);

router.get('/', delayMiddleware, getRecords);
router.get('/stats', delayMiddleware, getDashboardStats);
router.get('/:id', delayMiddleware, getRecordById);

export default router;
