const express = require('express');
const { getConversations, getMessages, sendMessage } = require('../controllers/messagesController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

router.get('/conversations', getConversations);
router.get('/:conversationId', getMessages);
router.post('/:conversationId', sendMessage);

module.exports = router;
