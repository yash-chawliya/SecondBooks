import express from 'express';
import { confirmOrder, getOrder, getUserOrders } from '../controllers/orderController.js';

const router = express.Router();

router.post('/confirmorder', confirmOrder);
router.get('/getorder/:orderid', getOrder);
router.get('/:userId/orders', getUserOrders);

export default router;
