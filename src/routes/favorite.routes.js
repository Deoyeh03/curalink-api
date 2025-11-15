import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { addFavorite, removeFavorite } from '../controllers/favorite.controller.js';

const router = express.Router();

router.post('/:itemId', authenticate, addFavorite);
router.delete('/:itemId', authenticate, removeFavorite);

export default router;
