import express from 'express';
import { estimateDelivery } from '../controllers/deliveryController.js';

const router = express.Router();

router.post('/estimate', estimateDelivery);

export default router;
