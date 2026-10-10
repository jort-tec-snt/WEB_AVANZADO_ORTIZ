import express from 'express';
import { authController } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

const router = express.Router();

router.post('/register', asyncHandler(authController.register));
router.post('/login', asyncHandler(authController.login));
router.get('/profile', verifyToken, asyncHandler(authController.profile));

export default router;
