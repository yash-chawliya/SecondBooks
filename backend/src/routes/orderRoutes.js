import express from 'express';
import { confirmOrder, getOrder, getUserOrders } from '../controllers/orderController.js';

const router = express.Router();

router.post('/confirm', confirmOrder);
router.get('/:orderId', getOrder);
router.get('/user/:userId', getUserOrders);

export default router;
