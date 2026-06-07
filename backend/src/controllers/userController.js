const getMe = async (req, res, next) => {
  try {
    // req.user is populated by authMiddleware.js
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'User context not loaded.' });
    }

    // In a real DB, you'd fetch from pg pool
    return res.status(200).json({
      success: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        username: req.user.username,
        role: req.user.role,
        department: req.user.department || 'Computer Science',
        academic_year: req.user.academic_year || 'Sophomore',
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMe,
};
