import express from 'express';
import { 
  getProfile, updateProfile, getDetails, checkUser, getUserId 
} from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Profile endpoints
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

// User information endpoints
router.get('/details/:userId', getDetails);
router.get('/check/:phone', checkUser);
router.get('/id/:phone', getUserId);

export default router;
