import * as postStore from '../data/postStore.js';
import { sendSuccess, sendError } from '../utils/http.js';

export const listPosts = (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const rawLimit = parseInt(req.query.limit, 10) || 10;
  
  // Server-side capping for limit
  const limit = Math.min(Math.max(1, rawLimit), 100);

  const allPosts = postStore.getAllPosts();
  const total = allPosts.length;
  const pages = Math.ceil(total / limit) || 1;
  const offset = (page - 1) * limit;

  const paginatedPosts = allPosts.slice(offset, offset + limit);

  return sendSuccess(res, paginatedPosts, 200, {
    page,
    limit,
    total,
    pages
  });
};

export const getPost = (req, res) => {
  const post = postStore.getPostById(req.params.id);
  if (!post) {
    return sendError(res, 'NOT_FOUND', 'Post not found', 404);
  }
  return sendSuccess(res, post, 200);
};

export const createPost = (req, res) => {
  const { title, content } = req.body;
  if (!title) {
    return sendError(res, 'VALIDATION_ERROR', 'Title is required', 400);
  }
  const newPost = postStore.createPost({ title, content });
  return sendSuccess(res, newPost, 201);
};

export const likePost = (req, res) => {
  const updatedPost = postStore.likePost(req.params.id);
  if (!updatedPost) {
    return sendError(res, 'NOT_FOUND', 'Post not found', 404);
  }
  return sendSuccess(res, updatedPost, 201);
};