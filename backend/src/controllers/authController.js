const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, username: user.username, role: user.role },
    process.env.JWT_SECRET || 'dev_secret',
    { expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret',
    { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d' }
  );

  return { accessToken, refreshToken };
};
const register = async (req, res, next) => {
  try {
    const { full_name, username, email, password, department, academic_year, profile_image } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    if (!normalizedEmail.includes('@')) {
      return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
    }

    // Check duplicate email or username
    const existingUser = await db.query(
      'SELECT id FROM users WHERE LOWER(email) = LOWER($1) OR LOWER(username) = LOWER($2)',
      [normalizedEmail, username.trim()]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'User with this email or username already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const insertQuery = `
      INSERT INTO users (full_name, username, email, password_hash, role, department, academic_year, profile_image, is_verified)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, full_name, username, email, role, department, academic_year, profile_image, is_verified, created_at
    `;
    const values = [
      full_name,
      username.trim(),
      normalizedEmail,
      password_hash,
      'student',
      department || 'Undeclared',
      academic_year || 'Freshman',
      profile_image || '',
      false,
    ];

    const result = await db.query(insertQuery, values);
    const newUser = result.rows[0];

    const { accessToken, refreshToken } = generateTokens(newUser);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      accessToken,
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const result = await db.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [normalizedEmail]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid email or password credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Invalid email or password credentials.' });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Return user without sensitive fields
    const { password_hash: _, ...userResponse } = user;

    return res.status(200).json({
      success: true,
      accessToken,
      user: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ success: false, error: 'Refresh token not found.' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret');
    const result = await db.query('SELECT id, email, username, role FROM users WHERE id = $1', [decoded.id]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid token or session expired.' });
    }

    const tokens = generateTokens(user);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid session/refresh token.' });
  }
};

const logout = (req, res) => {
  res.clearCookie('refreshToken');
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
};

const getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }
    const result = await db.query(
      'SELECT id, full_name, username, email, role, department, academic_year, profile_image, bio, github_url, linkedin_url, is_verified, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  getMe,
};
