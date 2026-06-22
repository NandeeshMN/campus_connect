const db = require('../config/db');
const bcrypt = require('bcryptjs');

const getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'User context not loaded.' });
    }
    const result = await db.query(
      'SELECT id, full_name, username, email, role, department, academic_year, profile_image, cover_image, bio, github_url, linkedin_url, is_private, is_verified, created_at FROM users WHERE id = $1 AND deleted_at IS NULL',
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

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { full_name, username, bio, department, academic_year, github_url, linkedin_url, profile_image, cover_image } = req.body;

    // Optional: add validation for unique username here if changed

    const updateQuery = `
      UPDATE users 
      SET full_name = COALESCE($1, full_name),
          username = COALESCE($2, username),
          bio = COALESCE($3, bio),
          department = COALESCE($4, department),
          academic_year = COALESCE($5, academic_year),
          github_url = COALESCE($6, github_url),
          linkedin_url = COALESCE($7, linkedin_url),
          profile_image = COALESCE($8, profile_image),
          cover_image = COALESCE($9, cover_image),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $10 AND deleted_at IS NULL
      RETURNING id, full_name, username, email, bio, department, academic_year, github_url, linkedin_url, profile_image, cover_image
    `;

    const values = [full_name, username, bio, department, academic_year, github_url, linkedin_url, profile_image, cover_image, userId];
    
    const result = await db.query(updateQuery, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'Profile updated successfully', user: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

const changeEmail = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { new_email, password } = req.body;
    
    const normalizedEmail = new_email.toLowerCase().trim();

    // Verify password first
    const userRes = await db.query('SELECT password_hash FROM users WHERE id = $1 AND deleted_at IS NULL', [userId]);
    const user = userRes.rows[0];
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect current password' });
    }

    // Check duplicate
    const existing = await db.query('SELECT id FROM users WHERE LOWER(email) = $1 AND id != $2', [normalizedEmail, userId]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    await db.query('UPDATE users SET email = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [normalizedEmail, userId]);
    res.json({ success: true, message: 'Email updated successfully' });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { current_password, new_password } = req.body;

    const userRes = await db.query('SELECT password_hash FROM users WHERE id = $1 AND deleted_at IS NULL', [userId]);
    const user = userRes.rows[0];
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(current_password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect current password' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(new_password, salt);

    await db.query('UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [password_hash, userId]);
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    const userRes = await db.query('SELECT password_hash FROM users WHERE id = $1 AND deleted_at IS NULL', [userId]);
    const user = userRes.rows[0];
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect password' });
    }

    // Soft delete
    await db.query('UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1', [userId]);
    
    res.clearCookie('refreshToken');
    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ success: true, users: [] });
    
    const currentUserId = req.user.id;
    const query = `%${q}%`;
    const result = await db.query(
      `SELECT id, full_name, username, profile_image 
       FROM users 
       WHERE (full_name ILIKE $1 OR username ILIKE $1)
       AND id != $2 AND deleted_at IS NULL
       LIMIT 10`,
      [query, currentUserId]
    );
    res.json({ success: true, users: result.rows });
  } catch (error) {
    next(error);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'SELECT id, full_name, username, email, role, department, academic_year, profile_image, cover_image, bio, github_url, linkedin_url, is_private, is_verified, created_at FROM users WHERE id = $1 AND deleted_at IS NULL',
      [id]
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

const visitUserProfile = async (req, res, next) => {
  try {
    const viewerId = req.user.id;
    const profileOwnerId = parseInt(req.params.id);

    if (viewerId === profileOwnerId) {
      return res.json({ success: true, message: 'Self visit not logged.' });
    }

    // Check if visit logged within last 1 hour
    const checkRes = await db.query(
      "SELECT 1 FROM profile_visits WHERE viewer_id = $1 AND profile_owner_id = $2 AND visited_at > NOW() - INTERVAL '1 hour'",
      [viewerId, profileOwnerId]
    );

    if (checkRes.rows.length === 0) {
      await db.query(
        'INSERT INTO profile_visits (viewer_id, profile_owner_id) VALUES ($1, $2)',
        [viewerId, profileOwnerId]
      );
    }

    res.json({ success: true, message: 'Profile visit logged successfully.' });
  } catch (error) {
    next(error);
  }
};

const getSuggestedUsers = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;

    // Fetch current user details
    const userRes = await db.query('SELECT department, academic_year FROM users WHERE id = $1', [currentUserId]);
    const user = userRes.rows[0];
    const dept = user ? user.department : null;
    const acadYear = user ? user.academic_year : null;

    // SQL query to calculate score:
    // +2 for same department, +1 for same academic year, +3 for each mutual connection
    const query = `
      SELECT u.id, u.full_name, u.username, u.profile_image, u.department, u.academic_year,
             (
               CASE WHEN u.department = $2 THEN 2 ELSE 0 END +
               CASE WHEN u.academic_year = $3 THEN 1 ELSE 0 END +
               (SELECT COUNT(*) 
                FROM followers f1
                JOIN followers f2 ON f1.following_id = f2.follower_id
                WHERE f1.follower_id = $1 AND f2.following_id = u.id) * 3
             ) AS score
      FROM users u
      WHERE u.id != $1
        AND u.deleted_at IS NULL
        AND u.id NOT IN (SELECT following_id FROM followers WHERE follower_id = $1)
      ORDER BY score DESC, u.created_at DESC
      LIMIT 5
    `;

    const result = await db.query(query, [currentUserId, dept, acadYear]);
    res.json({ success: true, users: result.rows });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMe,
  updateProfile,
  changeEmail,
  changePassword,
  deleteAccount,
  searchUsers,
  getUserProfile,
  visitUserProfile,
  getSuggestedUsers
};

