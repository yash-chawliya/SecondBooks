import express from 'express';
import { 
  getProfile, updateProfile, deleteAddress, getAddress, 
  addAddress, getCart, updateCart, addToCart, removeFromCart, 
  getDetails, checkUser, getUserId 
} from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.post('/address/delete', authMiddleware, deleteAddress);
router.get('/address/:userId', getAddress);
router.post('/address', addAddress);

// Cart routes
router.get('/cart/:userId', getCart);
router.get('/updateCart/:userId', updateCart);
router.post('/cart/add/:bookId', addToCart);
router.post('/cart/remove/:bookId', removeFromCart);

router.get('/getDetails/:userId', getDetails);
router.get('/checkuser/:phone', checkUser);
router.get('/getuserid/:phone', getUserId);

export default router;
