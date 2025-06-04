import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { getMe } from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);

export default router;
