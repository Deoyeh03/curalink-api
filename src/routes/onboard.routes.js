import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { onboardNL, updateProfile } from '../controllers/onboard.controller.js';

const router = express.Router();

// POST /api/onboard/nl - Parse natural language profile
router.post('/nl', authenticate, onboardNL);

// PUT /api/onboard/profile - Update profile manually
router.put('/profile', authenticate, updateProfile);

export default router;  // ← Make sure this line exists!