const db = require('../config/db');

// GET /api/notifications
exports.getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await db.query(
      `SELECT n.id, n.user_id, n.actor_id, n.type, n.reference_id, n.message, n.is_read, n.created_at,
              u.full_name as actor_name, u.username as actor_username, u.profile_image as actor_image
       FROM notifications n
       LEFT JOIN users u ON n.actor_id = u.id
       WHERE n.user_id = $1
       ORDER BY n.created_at DESC
       LIMIT 50`,
      [userId]
    );
    res.json({ success: true, notifications: result.rows });
  } catch (error) {
    next(error);
  }
};

// GET /api/notifications/unread-count
exports.getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await db.query(
      'SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false',
      [userId]
    );
    res.json({ success: true, count: parseInt(result.rows[0].count) || 0 });
  } catch (error) {
    next(error);
  }
};

// PUT /api/notifications/mark-read
exports.markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await db.query(
      'UPDATE notifications SET is_read = true WHERE user_id = $1',
      [userId]
    );
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

// PUT /api/notifications/:id/read
exports.markAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    await db.query(
      'UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    next(error);
  }
};
