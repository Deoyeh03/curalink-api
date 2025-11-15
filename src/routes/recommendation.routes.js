import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { generateRecommendations } from '../controllers/recommendation.controller.js';

const router = express.Router();

router.get('/', authenticate, generateRecommendations);

export default router;
