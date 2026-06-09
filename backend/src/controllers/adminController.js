const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const result = await db.query('SELECT * FROM admin WHERE email = $1', [email]);
    const adminUser = result.rows[0];

    if (!adminUser) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    const isMatch = await bcrypt.compare(password, adminUser.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    const token = jwt.sign(
      { id: adminUser.id, email: adminUser.email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.json({
      success: true,
      message: 'Admin login successful',
      token,
      admin: {
        id: adminUser.id,
        full_name: adminUser.full_name,
        email: adminUser.email,
        role: 'admin'
      }
    });
  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  res.clearCookie('adminToken');
  res.json({ success: true, message: 'Admin logged out successfully' });
};

const getDashboardStats = async (req, res, next) => {
  try {
    const studentsResult = await db.query('SELECT COUNT(*) FROM users');
    const postsResult = await db.query('SELECT COUNT(*) FROM posts');
    const resourcesResult = await db.query('SELECT COUNT(*) FROM resources');
    
    const reportedPostsResult = await db.query("SELECT COUNT(*) FROM reports WHERE target_type = 'post' AND status = 'pending'");
    const reportedUsersResult = await db.query("SELECT COUNT(*) FROM reports WHERE target_type = 'user' AND status = 'pending'");

    const recentActivitiesResult = await db.query(`
      SELECT a.*, admin.full_name as admin_name 
      FROM audit_logs a 
      LEFT JOIN admin ON a.admin_id = admin.id 
      ORDER BY a.created_at DESC 
      LIMIT 10
    `);

    res.json({
      success: true,
      stats: {
        totalStudents: parseInt(studentsResult.rows[0].count),
        totalPosts: parseInt(postsResult.rows[0].count),
        totalResources: parseInt(resourcesResult.rows[0].count),
        reportedPosts: parseInt(reportedPostsResult.rows[0].count),
        reportedUsers: parseInt(reportedUsersResult.rows[0].count),
      },
      recentActivities: recentActivitiesResult.rows
    });
  } catch (error) {
    next(error);
  }
};

const getAdminProfile = async (req, res, next) => {
  try {
    const adminId = req.admin.id;
    const result = await db.query('SELECT id, full_name, email, created_at FROM admin WHERE id = $1', [adminId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    res.json({
      success: true,
      admin: {
        ...result.rows[0],
        role: 'admin'
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  logout,
  getDashboardStats,
  getAdminProfile
};
