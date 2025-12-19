import { Router } from 'express';
import cookieJwtAuth from '../middleware/authMiddleware.js';
import { getMyOrders, getOrderById } from '../controllers/order.controller.js';

const router = Router();

// GET /api/orders - list current user's orders
router.get('/', cookieJwtAuth, getMyOrders);

// GET /api/orders/:id - get a specific order (owned by user)
router.get('/:id', cookieJwtAuth, getOrderById);

export default router;
