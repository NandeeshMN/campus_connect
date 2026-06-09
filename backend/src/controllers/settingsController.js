const db = require('../config/db');

const updatePrivacySettings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { is_private, message_permission } = req.body;

    // Update users table for is_private
    if (is_private !== undefined) {
      await db.query(
        'UPDATE users SET is_private = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [is_private, userId]
      );
    }

    // Update user_settings table for message_permission
    if (message_permission) {
      await db.query(
        `INSERT INTO user_settings (user_id, message_permission) 
         VALUES ($1, $2) 
         ON CONFLICT (user_id) DO UPDATE SET message_permission = EXCLUDED.message_permission`,
        [userId, message_permission]
      );
    }

    res.json({ success: true, message: 'Privacy settings updated successfully' });
  } catch (error) {
    next(error);
  }
};

const updateTheme = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { theme } = req.body;

    if (!['light', 'dark', 'system'].includes(theme)) {
      return res.status(400).json({ success: false, message: 'Invalid theme value' });
    }

    await db.query(
      `INSERT INTO user_settings (user_id, theme) 
       VALUES ($1, $2) 
       ON CONFLICT (user_id) DO UPDATE SET theme = EXCLUDED.theme`,
      [userId, theme]
    );

    res.json({ success: true, message: 'Theme updated successfully' });
  } catch (error) {
    next(error);
  }
};

const setupTwoFactor = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { enable } = req.body;

    // Simulate 2FA toggle since full OTP implementation requires external libs like speakeasy
    await db.query(
      'UPDATE users SET two_factor_enabled = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [enable, userId]
    );

    res.json({ success: true, message: `Two-Factor Authentication ${enable ? 'enabled' : 'disabled'} successfully.` });
  } catch (error) {
    next(error);
  }
};

const getActivityHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch liked posts
    const likes = await db.query(
      `SELECT p.id, p.content, u.full_name as author, l.created_at as timestamp, 'liked' as type 
       FROM likes l 
       JOIN posts p ON l.post_id = p.id 
       JOIN users u ON p.user_id = u.id 
       WHERE l.user_id = $1 ORDER BY l.created_at DESC LIMIT 10`,
      [userId]
    );

    // Fetch commented posts
    const comments = await db.query(
      `SELECT p.id, c.content as preview, u.full_name as author, c.created_at as timestamp, 'commented' as type 
       FROM comments c 
       JOIN posts p ON c.post_id = p.id 
       JOIN users u ON p.user_id = u.id 
       WHERE c.user_id = $1 ORDER BY c.created_at DESC LIMIT 10`,
      [userId]
    );

    // Fetch saved posts
    const saved = await db.query(
      `SELECT p.id, p.content, u.full_name as author, s.created_at as timestamp, 'saved' as type 
       FROM saved_posts s 
       JOIN posts p ON s.post_id = p.id 
       JOIN users u ON p.user_id = u.id 
       WHERE s.user_id = $1 ORDER BY s.created_at DESC LIMIT 10`,
      [userId]
    );

    res.json({
      success: true,
      activity: {
        likes: likes.rows,
        comments: comments.rows,
        saved: saved.rows,
        shared: [] // Placeholder if shares table is used
      }
    });
  } catch (error) {
    next(error);
  }
};

const getBlockedUsers = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await db.query(
      `SELECT u.id, u.full_name, u.username, u.profile_image 
       FROM blocked_users b 
       JOIN users u ON b.blocked_id = u.id 
       WHERE b.blocker_id = $1`,
      [userId]
    );

    res.json({ success: true, blockedUsers: result.rows });
  } catch (error) {
    next(error);
  }
};

const unblockUser = async (req, res, next) => {
  try {
    const blockerId = req.user.id;
    const { id: blockedId } = req.params;

    await db.query(
      'DELETE FROM blocked_users WHERE blocker_id = $1 AND blocked_id = $2',
      [blockerId, blockedId]
    );

    res.json({ success: true, message: 'User unblocked successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updatePrivacySettings,
  updateTheme,
  setupTwoFactor,
  getActivityHistory,
  getBlockedUsers,
  unblockUser
};
