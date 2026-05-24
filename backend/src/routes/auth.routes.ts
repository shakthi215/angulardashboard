import { Router } from 'express';
import { login, getProfile, logout } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { delayMiddleware } from '../middleware/delay.middleware';

const router = Router();

router.post('/login', delayMiddleware, login);
router.get('/profile', authenticate, delayMiddleware, getProfile);
router.post('/logout', authenticate, logout);

export default router;
