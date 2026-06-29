import express from 'express';
import { estimateDelivery } from '../controllers/deliveryController.js';

const router = express.Router();

router.post('/estimate-delivery', estimateDelivery);

export default router;
