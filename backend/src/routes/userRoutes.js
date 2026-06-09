const express = require('express');
const { getMe, updateProfile, changeEmail, changePassword, deleteAccount } = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

router.get('/me', getMe);
router.put('/update-profile', updateProfile);
router.put('/change-email', changeEmail);
router.put('/change-password', changePassword);
router.delete('/delete-account', deleteAccount);

module.exports = router;
