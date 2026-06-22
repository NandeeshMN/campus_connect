const express = require('express');
const router = express.Router();
const {
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead
} = require('../controllers/notificationsController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', authenticate, getNotifications);
router.get('/unread-count', authenticate, getUnreadCount);
router.put('/mark-read', authenticate, markAllAsRead);
router.put('/:id/read', authenticate, markAsRead);

module.exports = router;
