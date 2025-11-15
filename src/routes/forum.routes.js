import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getPosts, createPost, addComment } from '../controllers/forum.controller.js';

const router = express.Router();

router.get('/', getPosts);
router.post('/', authenticate, createPost);
router.post('/:id/comments', authenticate, addComment);

export default router;
