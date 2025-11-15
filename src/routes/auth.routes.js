import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { registerUser, loginUser, refreshToken, getProfile } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshToken);
router.get('/profile', authenticate, getProfile);

export default router;
