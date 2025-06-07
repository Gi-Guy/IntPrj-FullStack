import { Router } from 'express';
import { getMyTasks, createTask, deleteTask } from '../controllers/taskController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);
router.get('/', getMyTasks);
router.post('/', createTask);
router.delete('/:id', deleteTask);

export default router;
