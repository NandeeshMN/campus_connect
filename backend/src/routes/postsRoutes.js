const express = require('express');
const router = express.Router();
const {
  createPost,
  getPosts,
  getPostsByUser,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  commentOnPost,
  deleteComment,
  sharePost,
  getComments
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

// Get posts by user
router.get('/user/:userId', authenticate, getPostsByUser);

// Like / Unlike a post
router.post('/:id/like', authenticate, likePost);

// Comment on a post
router.post('/:id/comment', authenticate, commentOnPost);

// Delete a comment
router.delete('/comment/:commentId', authenticate, deleteComment);

// Get comments for a post
router.get('/:id/comments', authenticate, getComments);

// Share a post
router.post('/:id/share', authenticate, sharePost);


module.exports = router;
