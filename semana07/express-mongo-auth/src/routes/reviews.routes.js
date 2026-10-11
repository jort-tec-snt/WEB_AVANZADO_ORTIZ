import express from 'express';
import ReviewController from '../controllers/ReviewController.js';
import authenticate from '../middlewares/authenticate.js';
import authorize from '../middlewares/authorize.js';

const router = express.Router();

router.get('/', authenticate, authorize([]), ReviewController.getAll);
router.get('/:id/image', ReviewController.image);
router.post('/', authenticate, authorize(['admin']), ReviewController.create);
router.put('/:id', authenticate, authorize(['admin']), ReviewController.update);
router.delete('/:id', authenticate, authorize(['admin']), ReviewController.remove);

export default router;
