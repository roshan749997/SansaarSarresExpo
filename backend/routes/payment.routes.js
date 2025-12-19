import { Router } from 'express';
import { createOrder, verifyPayment, createCodOrder, createPayment, paymentSuccess, paymentFailure } from '../controllers/payment.controller.js';
import cookieJwtAuth from '../middleware/authMiddleware.js';

const router = Router();

// Razorpay routes
router.post('/orders', createOrder);
router.post('/verify', cookieJwtAuth, verifyPayment);

// New Payment Gateway routes
router.post('/create', cookieJwtAuth, createPayment);
router.post('/success', paymentSuccess); // No auth - callback from payment gateway
router.post('/failure', paymentFailure); // No auth - callback from payment gateway

// COD route
router.post('/cod', cookieJwtAuth, createCodOrder);

export default router;
