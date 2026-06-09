const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const {
  updatePrivacySettings,
  updateTheme,
  setupTwoFactor,
  getActivityHistory,
  getBlockedUsers,
  unblockUser
} = require('../controllers/settingsController');

// All settings routes require authentication
router.use(authenticate);

router.put('/privacy', updatePrivacySettings);
router.put('/theme', updateTheme);
router.put('/security', setupTwoFactor);
router.get('/activity', getActivityHistory);
router.get('/blocked-users', getBlockedUsers);
router.delete('/unblock-user/:id', unblockUser);

module.exports = router;
