const express = require('express');
const router = express.Router();
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost
} = require('../controllers/postsController');
const { authenticate } = require('../middleware/authMiddleware');

// Get all posts
router.get('/', authenticate, getPosts);

// Get post by ID
router.get('/:id', authenticate, getPostById);

// Create a new post
router.post('/create', authenticate, createPost);

// Update a post
router.put('/:id', authenticate, updatePost);

// Delete a post
router.delete('/:id', authenticate, deletePost);

module.exports = router;
