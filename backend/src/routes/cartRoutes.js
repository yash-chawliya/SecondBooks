import express from 'express';
import { getCart, updateCart, addToCart, removeFromCart } from '../controllers/userController.js';

const router = express.Router();

router.get('/:userId', getCart);
router.get('/refresh/:userId', updateCart);
router.post('/add/:bookId', addToCart);
router.post('/remove/:bookId', removeFromCart);

export default router;
