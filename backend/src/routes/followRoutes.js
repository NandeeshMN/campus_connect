const express = require('express');
const router = express.Router();
const {
  followUser,
  unfollowUser,
  getFollowStatus,
  getFollowers,
  getFollowing
} = require('../controllers/followController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/follow/:userId', authenticate, followUser);
router.delete('/follow/:userId', authenticate, unfollowUser);
router.get('/follow/status/:userId', authenticate, getFollowStatus);
router.get('/followers/:userId', authenticate, getFollowers);
router.get('/following/:userId', authenticate, getFollowing);

module.exports = router;
