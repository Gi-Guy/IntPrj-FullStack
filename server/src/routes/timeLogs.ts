import { Router } from 'express';
import { getTimeLogs, createTimeLog, deleteTimeLog, getTimeLogByTaskId } from '../controllers/timeLogController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);
router.get('/', getTimeLogs);
router.get('/:taskId', getTimeLogByTaskId);
router.post('/', createTimeLog);
router.delete('/:id', deleteTimeLog);

export default router;