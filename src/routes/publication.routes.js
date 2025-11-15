import express from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import { getPublications, addPublication } from '../controllers/publication.controller.js';

const router = express.Router();

router.get('/', getPublications);
router.post('/', authenticate, authorizeRoles('RESEARCHER', 'ADMIN'), addPublication);

export default router;
