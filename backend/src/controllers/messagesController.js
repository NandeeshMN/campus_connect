const db = require('../config/db');

exports.getConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await db.query(
      `SELECT c.id, 
              u.id as other_user_id, u.full_name, u.username, u.profile_image,
              (SELECT message_text FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_msg,
              (SELECT message_type FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_msg_type,
              (SELECT created_at FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_msg_time
       FROM conversations c
       JOIN conversation_participants cp ON c.id = cp.conversation_id
       JOIN users u ON cp.user_id = u.id
       WHERE c.id IN (SELECT conversation_id FROM conversation_participants WHERE user_id = $1)
       AND u.id != $1
       ORDER BY last_msg_time DESC NULLS LAST`,
      [userId]
    );
    res.json({ success: true, conversations: result.rows });
  } catch (error) {
    next(error);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    // Verify participant
    const check = await db.query('SELECT 1 FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2', [conversationId, userId]);
    if (check.rows.length === 0) return res.status(403).json({ success: false, error: 'Not participant' });

    const result = await db.query(
      `SELECT m.*, u.full_name, u.profile_image,
        CASE WHEN m.message_type = 'shared_post' THEN (
          SELECT row_to_json(p_data) FROM (
            SELECT p.*, p.id as post_id,
                   pu.id as author_id, pu.full_name as author_name, pu.username as author_username, pu.profile_image as author_profile_picture,
                   pu.full_name, pu.username, pu.profile_image,
                   EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = $2) as is_liked
            FROM posts p
            JOIN users pu ON p.user_id = pu.id
            WHERE p.id = m.shared_post_id
          ) p_data
        ) ELSE NULL END as shared_post_data
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.conversation_id = $1
       ORDER BY m.created_at ASC`,
      [conversationId, userId]
    );

    res.json({ success: true, messages: result.rows });
  } catch (error) {
    next(error);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { message_text } = req.body;
    const senderId = req.user.id;

    const result = await db.query(
      'INSERT INTO messages (conversation_id, sender_id, message_text, message_type) VALUES ($1, $2, $3, $4) RETURNING *',
      [conversationId, senderId, message_text, 'text']
    );

    res.json({ success: true, message: result.rows[0] });
  } catch (error) {
    next(error);
  }
};
