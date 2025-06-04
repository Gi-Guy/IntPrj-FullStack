import { Router } from 'express';
import { getTasks, createTask, deleteTask } from '../controllers/taskController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);
router.get('/', getTasks);
router.post('/', createTask);
router.delete('/:id', deleteTask);

export default router;
