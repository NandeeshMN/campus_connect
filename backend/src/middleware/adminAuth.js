const jwt = require('jsonwebtoken');

const adminAuthenticate = (req, res, next) => {
  try {
    let token = null;

    // Check authorization header first
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } 
    // Fallback check in cookie (specifically looking for adminToken)
    else if (req.cookies && req.cookies.adminToken) {
      token = req.cookies.adminToken;
    }

    if (!token) {
      return res.status(401).json({ success: false, error: 'Admin access token missing.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Forbidden. Admin privileges required.' });
    }

    req.admin = decoded; // Contains id, email, role: 'admin'
    next();
  } catch (error) {
    console.error('Admin Authentication Error:', error.message);
    return res.status(401).json({ success: false, error: 'Unauthorized. Token expired or invalid.' });
  }
};

module.exports = {
  adminAuthenticate,
};
