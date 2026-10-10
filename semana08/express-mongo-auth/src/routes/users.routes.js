import express from 'express';
import { userController } from '../controllers/userController.js';
import { verifyToken, requireRole } from '../middlewares/authMiddleware.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

const router = express.Router();

router.use(verifyToken); // todas las rutas de /api/users exigen token

router.get('/', requireRole('admin'), asyncHandler(userController.getAll));
router.get('/:id', asyncHandler(userController.getById));
router.put('/:id', requireRole('admin'), asyncHandler(userController.update));
router.delete('/:id', requireRole('admin'), asyncHandler(userController.remove));

export default router;
