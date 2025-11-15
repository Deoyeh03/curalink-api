import express from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import { getAllTrials, addTrial } from '../controllers/trial.controller.js';

const router = express.Router();

router.get('/', getAllTrials);
router.post('/', authenticate, authorizeRoles('RESEARCHER', 'ADMIN'), addTrial);

export default router;
