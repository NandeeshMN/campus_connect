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
      `SELECT p.*, p.id as post_id, 
              u.id as author_id, u.full_name as author_name, u.username as author_username, u.profile_image as author_profile_picture,
              u.full_name, u.username, u.profile_image,
              EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = $2) as is_liked
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = $1`,
      [result.rows[0].id, userId]
    );

    res.status(201).json({ success: true, post: postResult.rows[0] });
  } catch (error) {
    next(error);
  }
};

exports.getPosts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await db.query(
      `SELECT p.*, p.id as post_id,
              u.id as author_id, u.full_name as author_name, u.username as author_username, u.profile_image as author_profile_picture,
              u.full_name, u.username, u.profile_image,
              EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = $1) as is_liked
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.is_deleted = false AND p.is_hidden = false
       ORDER BY p.created_at DESC`,
      [userId]
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
      `SELECT p.*, p.id as post_id,
              u.id as author_id, u.full_name as author_name, u.username as author_username, u.profile_image as author_profile_picture,
              u.full_name, u.profile_image 
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
      `SELECT p.*, p.id as post_id,
              u.id as author_id, u.full_name as author_name, u.username as author_username, u.profile_image as author_profile_picture,
              u.full_name, u.username, u.profile_image,
              EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = $2) as is_liked
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = $1`,
      [id, userId]
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

    await db.query('DELETE FROM posts WHERE id = $1 AND user_id = $2', [id, userId]);

    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getPostsByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;
    const result = await db.query(
      `SELECT p.*, p.id as post_id,
              u.id as author_id, u.full_name as author_name, u.username as author_username, u.profile_image as author_profile_picture,
              u.full_name, u.username, u.profile_image,
              EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = $2) as is_liked
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.user_id = $1 AND p.is_deleted = false AND p.is_hidden = false
       ORDER BY p.created_at DESC`,
      [userId, currentUserId]
    );
    res.json({ success: true, posts: result.rows });
  } catch (error) {
    next(error);
  }
};

exports.likePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if post exists
    const postCheck = await db.query('SELECT id FROM posts WHERE id = $1 AND is_deleted = false', [id]);
    if (postCheck.rows.length === 0) return res.status(404).json({ success: false, error: 'Post not found' });

    // Check if already liked
    const likeCheck = await db.query('SELECT id FROM likes WHERE post_id = $1 AND user_id = $2', [id, userId]);
    
    if (likeCheck.rows.length === 0) {
      // Like
      await db.query('INSERT INTO likes (post_id, user_id) VALUES ($1, $2)', [id, userId]);
      await db.query('UPDATE posts SET like_count = COALESCE(like_count, 0) + 1 WHERE id = $1', [id]);
      res.json({ success: true, is_liked: true });
    } else {
      // Unlike
      await db.query('DELETE FROM likes WHERE post_id = $1 AND user_id = $2', [id, userId]);
      await db.query('UPDATE posts SET like_count = GREATEST(COALESCE(like_count, 0) - 1, 0) WHERE id = $1', [id]);
      res.json({ success: true, is_liked: false });
    }
  } catch (error) {
    next(error);
  }
};

exports.commentOnPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { comment_text } = req.body;

    if (!comment_text || !comment_text.trim()) {
      return res.status(400).json({ success: false, error: 'Comment text is required' });
    }

    const result = await db.query(
      'INSERT INTO comments (post_id, user_id, comment_text, updated_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *',
      [id, userId, comment_text.trim()]
    );

    await db.query('UPDATE posts SET comment_count = COALESCE(comment_count, 0) + 1 WHERE id = $1', [id]);

    const commentWithUser = await db.query(
      'SELECT c.*, u.full_name, u.username, u.profile_image FROM comments c JOIN users u ON c.user_id = u.id WHERE c.id = $1',
      [result.rows[0].id]
    );

    res.json({ success: true, comment: commentWithUser.rows[0] });
  } catch (error) {
    next(error);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const commentCheck = await db.query('SELECT user_id, post_id FROM comments WHERE id = $1', [commentId]);
    if (commentCheck.rows.length === 0) return res.status(404).json({ success: false, error: 'Comment not found' });
    
    if (commentCheck.rows[0].user_id !== userId) {
      return res.status(403).json({ success: false, error: 'Unauthorized to delete this comment' });
    }

    const postId = commentCheck.rows[0].post_id;
    await db.query('DELETE FROM comments WHERE id = $1 AND user_id = $2', [commentId, userId]);
    await db.query('UPDATE posts SET comment_count = GREATEST(COALESCE(comment_count, 0) - 1, 0) WHERE id = $1', [postId]);

    res.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.sharePost = async (req, res, next) => {
  try {
    const { id } = req.params; // post id
    const senderId = req.user.id;
    const { receiverIds } = req.body;

    if (!receiverIds || !Array.isArray(receiverIds) || receiverIds.length === 0) {
      return res.status(400).json({ success: false, error: 'Receivers are required' });
    }

    for (const receiverId of receiverIds) {
      // Find or create conversation
      // We assume simple 1-on-1 conversations for now, but you could implement proper multi-user logic
      let convResult = await db.query(
        `SELECT c.id 
         FROM conversations c
         JOIN conversation_participants cp1 ON c.id = cp1.conversation_id AND cp1.user_id = $1
         JOIN conversation_participants cp2 ON c.id = cp2.conversation_id AND cp2.user_id = $2
         GROUP BY c.id HAVING COUNT(cp1.user_id) = 1 AND COUNT(cp2.user_id) = 1`,
        [senderId, receiverId]
      );
      
      let conversationId;
      if (convResult.rows.length > 0) {
        conversationId = convResult.rows[0].id;
      } else {
        const newConv = await db.query('INSERT INTO conversations DEFAULT VALUES RETURNING id');
        conversationId = newConv.rows[0].id;
        await db.query('INSERT INTO conversation_participants (conversation_id, user_id) VALUES ($1, $2), ($1, $3)', [conversationId, senderId, receiverId]);
      }

      await db.query(
        'INSERT INTO messages (conversation_id, sender_id, message_type, shared_post_id) VALUES ($1, $2, $3, $4)',
        [conversationId, senderId, 'shared_post', id]
      );
      
      await db.query('UPDATE posts SET share_count = COALESCE(share_count, 0) + 1 WHERE id = $1', [id]);
    }

    res.json({ success: true, message: 'Post shared successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getComments = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT c.*, u.full_name, u.username, u.profile_image 
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.post_id = $1
       ORDER BY c.created_at ASC`,
      [id]
    );
    res.json({ success: true, comments: result.rows });
  } catch (error) {
    next(error);
  }
};

