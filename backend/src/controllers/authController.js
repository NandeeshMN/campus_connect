const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Mock in-memory store for prototype/demo
const users = [];

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
    const { full_name, username, email, password, department, academic_year, profile_picture_url } = req.body;

    // Email validation (Removed restriction for current MVP phase)
    if (!email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
    }

    const emailExists = users.some(u => u.email === email);
    const usernameExists = users.some(u => u.username === username);

    if (emailExists || usernameExists) {
      return res.status(400).json({ success: false, error: 'User with this email or username already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = {
      id: `mock-uuid-${Date.now()}`,
      full_name,
      username,
      email,
      password_hash,
      role: 'student',
      department: department || 'Undeclared',
      academic_year: academic_year || 'Freshman',
      profile_picture_url: profile_picture_url || '',
      is_verified: false,
      created_at: new Date().toISOString(),
    };

    users.push(newUser);

    const { accessToken, refreshToken } = generateTokens(newUser);
    newUser.refresh_token = refreshToken;

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const { password_hash: _, refresh_token: __, ...userResponse } = newUser;

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      accessToken,
      user: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user = users.find(u => u.email === email);

    // If memory is empty (first boot), create mock users for demonstration
    if (!user && email === 'nandi@gmail.com') {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('nandi123', salt);
      user = {
        id: 'mock-uuid-nandi',
        full_name: 'Nandeesh M N',
        username: 'nandeesh',
        email: 'nandi@gmail.com',
        password_hash: hash,
        role: 'student',
        department: 'Computer Science',
        academic_year: 'Sophomore',
        profile_picture_url: '',
        is_verified: true,
      };
      users.push(user);
    }

    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid email or password credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Invalid email or password credentials.' });
    }

    const { accessToken, refreshToken } = generateTokens(user);
    user.refresh_token = refreshToken;

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password_hash: _, refresh_token: __, ...userResponse } = user;

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
    const user = users.find(u => u.id === decoded.id);

    if (!user || user.refresh_token !== refreshToken) {
      return res.status(401).json({ success: false, error: 'Invalid token or session expired.' });
    }

    const tokens = generateTokens(user);
    user.refresh_token = tokens.refreshToken;

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

module.exports = {
  register,
  login,
  refresh,
  logout,
};
