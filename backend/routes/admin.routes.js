import { Router } from 'express';
import auth from '../middleware/auth.js';
import adminOnly from '../middleware/admin.js';
import { createProduct, adminListProducts, deleteProductById, adminListOrders, adminStats, adminListAddresses, updateProduct } from '../controllers/admin.controller.js';

const router = Router();

// Products
router.post('/products', auth, adminOnly, createProduct);
router.get('/products', auth, adminOnly, adminListProducts);
router.patch('/products/:id', auth, adminOnly, updateProduct);
router.delete('/products/:id', auth, adminOnly, deleteProductById);

// Orders
router.get('/orders', auth, adminOnly, adminListOrders);

// Stats
router.get('/stats', auth, adminOnly, adminStats);

// Addresses
router.get('/addresses', auth, adminOnly, adminListAddresses);

export default router;
