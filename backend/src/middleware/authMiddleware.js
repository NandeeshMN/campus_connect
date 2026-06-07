const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  try {
    let token = null;

    // Check authorization header first
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } 
    // Fallback check in cookie
    else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({ success: false, error: 'Access token missing or invalid authorization.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains id, email, role, etc.
    next();
  } catch (error) {
    console.error('Authentication Error:', error.message);
    return res.status(401).json({ success: false, error: 'Unauthorized. Token expired or invalid.' });
  }
};

const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }
  return (req, res, next) => {
    if (!req.user || (roles.length && !roles.includes(req.user.role))) {
      return res.status(403).json({ success: false, error: 'Forbidden. Insufficient permissions.' });
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};
