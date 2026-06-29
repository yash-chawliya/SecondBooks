import express from 'express';
import { submitReview } from '../controllers/reviewController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/submit-review', authMiddleware, submitReview);

export default router;
