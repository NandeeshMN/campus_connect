const db = require('../config/db');
const cloudinary = require('../config/cloudinary');

// Map frontend labels to DB-allowed values: 'public' | 'private'
const normalizeVisibility = (val) => {
  if (!val) return 'public';
  const v = val.toLowerCase().trim();
  if (v === 'public') return 'public';
  if (v === 'private' || v === 'college only' || v === 'college_only') return 'private';
  return 'public'; // safe default
};

exports.createPost = async (req, res, next) => {
  try {
    const { caption, hashtags, image, visibility } = req.body;
    const userId = req.user.id;

    if (!caption) {
      return res.status(400).json({ success: false, error: 'Caption is required' });
    }

    let imageUrl = null;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: 'campusconnect/posts',
      });
      imageUrl = uploadResponse.secure_url;
    }

    const normalizedVisibility = normalizeVisibility(visibility);
    console.log('Visibility received:', visibility);
    console.log('Visibility stored:', normalizedVisibility);

    const result = await db.query(
      `INSERT INTO posts (user_id, caption, image_url, hashtags, visibility)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, caption, imageUrl, hashtags || null, normalizedVisibility]
    );

    // Fetch the inserted post with user details
    const postResult = await db.query(
      `SELECT p.*, u.full_name, u.profile_image 
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = $1`,
      [result.rows[0].id]
    );

    res.status(201).json({ success: true, post: postResult.rows[0] });
  } catch (error) {
    next(error);
  }
};

exports.getPosts = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT p.*, u.full_name, u.profile_image 
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.is_deleted = false AND p.is_hidden = false
       ORDER BY p.created_at DESC`
    );
    res.json({ success: true, posts: result.rows });
  } catch (error) {
    next(error);
  }
};

exports.getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT p.*, u.full_name, u.profile_image 
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = $1 AND p.is_deleted = false`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    res.json({ success: true, post: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { caption, hashtags, visibility, image, removeImage } = req.body;
    const userId = req.user.id;

    // Verify ownership
    const postCheck = await db.query('SELECT user_id, image_url FROM posts WHERE id = $1', [id]);
    if (postCheck.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    if (postCheck.rows[0].user_id !== userId) {
      return res.status(403).json({ success: false, error: 'Unauthorized to edit this post' });
    }

    let imageUrl = postCheck.rows[0].image_url;

    if (removeImage) {
      imageUrl = null;
    } else if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: 'campusconnect/posts',
      });
      imageUrl = uploadResponse.secure_url;
    }

    const normalizedVisibility = normalizeVisibility(visibility);
    console.log('Update visibility received:', visibility);
    console.log('Update visibility stored:', normalizedVisibility);

    const result = await db.query(
      `UPDATE posts 
       SET caption = $1, hashtags = $2, visibility = $3, image_url = $4, edited = true, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [caption, hashtags || null, normalizedVisibility, imageUrl, id]
    );

    const postResult = await db.query(
      `SELECT p.*, u.full_name, u.profile_image 
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = $1`,
      [id]
    );

    res.json({ success: true, post: postResult.rows[0] });
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify ownership
    const postCheck = await db.query('SELECT user_id FROM posts WHERE id = $1', [id]);
    if (postCheck.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    if (postCheck.rows[0].user_id !== userId) {
      return res.status(403).json({ success: false, error: 'Unauthorized to delete this post' });
    }

    await db.query('UPDATE posts SET is_deleted = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1', [id]);

    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};
