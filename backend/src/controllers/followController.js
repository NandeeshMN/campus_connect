const db = require('../config/db');

// POST /api/follow/:userId
exports.followUser = async (req, res, next) => {
  try {
    const followerId = req.user.id;
    const followingId = parseInt(req.params.userId);

    if (followerId === followingId) {
      return res.status(400).json({ success: false, error: 'You cannot follow yourself.' });
    }

    // Insert follow relation (ignore duplicate inserts)
    await db.query(
      'INSERT INTO followers (follower_id, following_id) VALUES ($1, $2) ON CONFLICT (follower_id, following_id) DO NOTHING',
      [followerId, followingId]
    );

    // Fetch follower details to create a notification
    const followerRes = await db.query('SELECT full_name FROM users WHERE id = $1', [followerId]);
    const followerName = followerRes.rows[0]?.full_name || 'Someone';

    // Insert follow notification (ignore duplicate notifications to avoid spamming B)
    const existingNotif = await db.query(
      "SELECT id FROM notifications WHERE user_id = $1 AND actor_id = $2 AND type = 'follow'",
      [followingId, followerId]
    );
    if (existingNotif.rows.length === 0) {
      await db.query(
        "INSERT INTO notifications (user_id, actor_id, type, message, is_read) VALUES ($1, $2, 'follow', $3, false)",
        [followingId, followerId, `${followerName} started following you.`]
      );
    }

    // Get updated counts
    const followersCountRes = await db.query('SELECT COUNT(*) FROM followers WHERE following_id = $1', [followingId]);
    const followingCountRes = await db.query('SELECT COUNT(*) FROM followers WHERE follower_id = $1', [followerId]);

    res.json({
      success: true,
      message: 'Followed user successfully',
      followersCount: parseInt(followersCountRes.rows[0].count) || 0,
      followingCount: parseInt(followingCountRes.rows[0].count) || 0,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/follow/:userId
exports.unfollowUser = async (req, res, next) => {
  try {
    const followerId = req.user.id;
    const followingId = parseInt(req.params.userId);

    await db.query(
      'DELETE FROM followers WHERE follower_id = $1 AND following_id = $2',
      [followerId, followingId]
    );

    // Optional: Delete follow notification
    await db.query(
      "DELETE FROM notifications WHERE user_id = $1 AND actor_id = $2 AND type = 'follow'",
      [followingId, followerId]
    );

    // Get updated counts
    const followersCountRes = await db.query('SELECT COUNT(*) FROM followers WHERE following_id = $1', [followingId]);
    const followingCountRes = await db.query('SELECT COUNT(*) FROM followers WHERE follower_id = $1', [followerId]);

    res.json({
      success: true,
      message: 'Unfollowed user successfully',
      followersCount: parseInt(followersCountRes.rows[0].count) || 0,
      followingCount: parseInt(followingCountRes.rows[0].count) || 0,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/follow/status/:userId
exports.getFollowStatus = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;
    const targetUserId = parseInt(req.params.userId);

    // Check if following
    const followCheck = await db.query(
      'SELECT EXISTS (SELECT 1 FROM followers WHERE follower_id = $1 AND following_id = $2)',
      [currentUserId, targetUserId]
    );
    const isFollowing = followCheck.rows[0].exists;

    // Get counts
    const followersCountRes = await db.query('SELECT COUNT(*) FROM followers WHERE following_id = $1', [targetUserId]);
    const followingCountRes = await db.query('SELECT COUNT(*) FROM followers WHERE follower_id = $1', [targetUserId]);
    
    // Get profile views count
    const viewsCountRes = await db.query('SELECT COUNT(*) FROM profile_visits WHERE profile_owner_id = $1', [targetUserId]);

    res.json({
      success: true,
      isFollowing,
      followersCount: parseInt(followersCountRes.rows[0].count) || 0,
      followingCount: parseInt(followingCountRes.rows[0].count) || 0,
      profileViewsCount: parseInt(viewsCountRes.rows[0].count) || 0
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/followers/:userId
exports.getFollowers = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;
    const targetUserId = parseInt(req.params.userId);

    // Fetch followers details, check if current user is following them
    const result = await db.query(
      `SELECT u.id, u.full_name, u.username, u.profile_image,
              EXISTS (
                SELECT 1 FROM followers f2 
                WHERE f2.follower_id = $2 AND f2.following_id = u.id
              ) AS is_following
       FROM followers f
       JOIN users u ON f.follower_id = u.id
       WHERE f.following_id = $1 AND u.deleted_at IS NULL
       ORDER BY f.created_at DESC`,
      [targetUserId, currentUserId]
    );

    res.json({
      success: true,
      followers: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/following/:userId
exports.getFollowing = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;
    const targetUserId = parseInt(req.params.userId);

    // Fetch following details, check if current user is following them
    const result = await db.query(
      `SELECT u.id, u.full_name, u.username, u.profile_image,
              EXISTS (
                SELECT 1 FROM followers f2 
                WHERE f2.follower_id = $2 AND f2.following_id = u.id
              ) AS is_following
       FROM followers f
       JOIN users u ON f.following_id = u.id
       WHERE f.follower_id = $1 AND u.deleted_at IS NULL
       ORDER BY f.created_at DESC`,
      [targetUserId, currentUserId]
    );

    res.json({
      success: true,
      following: result.rows,
    });
  } catch (error) {
    next(error);
  }
};
