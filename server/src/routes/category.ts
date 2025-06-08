import { Router } from 'express';
import { getCategories, createCategory, deleteCategory, ensureGeneralCategory } from '../controllers/categoryController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);
router.get('/', getCategories);
router.post('/', createCategory);
router.delete('/:id', deleteCategory);
router.post('/ensure-general', ensureGeneralCategory);

export default router;