import express from 'express';
import { deleteAddress, getAddress, addAddress } from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:userId', getAddress);
router.post('/', addAddress);
router.post('/delete', authMiddleware, deleteAddress);

export default router;
