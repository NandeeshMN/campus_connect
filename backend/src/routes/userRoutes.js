const express = require('express');
const { 
  getMe, 
  updateProfile, 
  changeEmail, 
  changePassword, 
  deleteAccount, 
  searchUsers,
  getUserProfile,
  visitUserProfile,
  getSuggestedUsers
} = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

router.get('/me', getMe);
router.put('/update-profile', updateProfile);
router.put('/change-email', changeEmail);
router.put('/change-password', changePassword);
router.delete('/delete-account', deleteAccount);
router.get('/search', searchUsers);
router.get('/suggested', getSuggestedUsers);
router.post('/:id/visit', visitUserProfile);
router.get('/:id', getUserProfile);

module.exports = router;

