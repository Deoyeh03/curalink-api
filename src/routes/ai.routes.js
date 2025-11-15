import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { askAI } from '../controllers/ai.controller.js';

const router = express.Router();

router.post('/', authenticate, askAI);

export default router;
