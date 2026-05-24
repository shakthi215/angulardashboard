import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  toggleUserStatus,
  deleteUser,
} from '../controllers/admin.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware';
import { delayMiddleware } from '../middleware/delay.middleware';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get('/users', delayMiddleware, getAllUsers);
router.get('/users/:id', delayMiddleware, getUserById);
router.post('/users', delayMiddleware, createUser);
router.put('/users/:id', delayMiddleware, updateUser);
router.patch('/users/:id/toggle-status', delayMiddleware, toggleUserStatus);
router.delete('/users/:id', delayMiddleware, deleteUser);

export default router;
