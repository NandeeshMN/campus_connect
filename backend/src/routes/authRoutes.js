const express = require('express');
const { register, login, refresh, logout } = require('../controllers/authController');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

const registerSchema = {
  full_name: { required: true, type: 'string', minLength: 2 },
  username: { required: true, type: 'string', minLength: 3 },
  email: { required: true, type: 'string', pattern: /^[^\s@]+@[^\s@]+\.edu(\.[^\s@]+)?$/ },
  password: { required: true, type: 'string', minLength: 6 },
};

const loginSchema = {
  email: { required: true, type: 'string' },
  password: { required: true, type: 'string' },
};

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);

module.exports = router;
