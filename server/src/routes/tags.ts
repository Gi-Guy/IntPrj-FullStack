import express from 'express';
import { createTag, getTags, deleteTag } from '../controllers/tagController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.use(authMiddleware);
router.get('/', getTags);
router.post('/', createTag);
router.delete('/:id', deleteTag);

export default router;