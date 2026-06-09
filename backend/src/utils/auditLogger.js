const db = require('../config/db');

const logAdminAction = async (adminId, action, targetType, targetId, details = {}) => {
  try {
    await db.query(
      `INSERT INTO audit_logs (admin_id, action, target_type, target_id, details) 
       VALUES ($1, $2, $3, $4, $5)`,
      [adminId, action, targetType, targetId, JSON.stringify(details)]
    );
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
};

module.exports = logAdminAction;
