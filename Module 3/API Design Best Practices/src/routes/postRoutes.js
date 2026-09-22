import { Router } from 'express';
import * as postController from '../controllers/postController.js';

const router = Router();

// Resource-based Noun Routes
router.get('/posts', postController.listPosts);
router.post('/posts', postController.createPost);
router.get('/posts/:id', postController.getPost);
router.post('/posts/:id/likes', postController.likePost);

// Internal failure demo route
router.get('/debug/error', (req, res, next) => {
  next(new Error('Simulated internal server error'));
});

export default router;