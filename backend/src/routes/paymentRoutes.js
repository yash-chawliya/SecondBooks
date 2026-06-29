import express from 'express';
import { createRazorpayOrder, verifyPayment } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-razorpay-order', createRazorpayOrder);
router.post('/payment-verification', verifyPayment);

export default router;
