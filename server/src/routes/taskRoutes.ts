import express from 'express';
import { getMyTasks, createTask, deleteTask } from '../controllers/taskController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', authenticate, getMyTasks);
router.post('/', authenticate, createTask);
router.delete('/:id', authenticate, deleteTask);

export default router;
