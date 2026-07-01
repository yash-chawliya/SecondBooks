import express from 'express';
import { login, phoneLogin, register, verifySession, logout } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/phone/login', phoneLogin);
router.post('/phone/register', register);
router.get('/verify-session', verifySession);
router.post('/logout', logout);

export default router;
