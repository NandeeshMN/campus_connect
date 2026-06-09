const db = require('../config/db');
const logAdminAction = require('../utils/auditLogger');

// --- USER MANAGEMENT ---
exports.getAllUsers = async (req, res, next) => {
  try {
    const result = await db.query(`
      SELECT id, first_name, last_name, email, university, major, graduation_year, status, created_at 
      FROM users 
      ORDER BY created_at DESC
    `);
    res.json({ success: true, users: result.rows });
  } catch (error) { next(error); }
};

exports.updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['active', 'suspended', 'deactivated'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const result = await db.query(
      'UPDATE users SET status = $1 WHERE id = $2 RETURNING id, first_name, last_name, email',
      [status, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });

    await logAdminAction(req.admin.id, 'update_user_status', 'user', id, { new_status: status });
    res.json({ success: true, user: result.rows[0], message: `User status updated to ${status}` });
  } catch (error) { next(error); }
};

// --- POST MANAGEMENT ---
exports.getAllPosts = async (req, res, next) => {
  try {
    const result = await db.query(`
      SELECT p.*, u.first_name, u.last_name, u.profile_picture 
      FROM posts p 
      JOIN users u ON p.user_id = u.id 
      ORDER BY p.created_at DESC
    `);
    res.json({ success: true, posts: result.rows });
  } catch (error) { next(error); }
};

exports.togglePostVisibility = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_hidden } = req.body;

    const result = await db.query(
      'UPDATE posts SET is_hidden = $1 WHERE id = $2 RETURNING id',
      [is_hidden, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Post not found' });

    await logAdminAction(req.admin.id, 'toggle_post_visibility', 'post', id, { is_hidden });
    res.json({ success: true, message: `Post visibility updated` });
  } catch (error) { next(error); }
};

// --- RESOURCES MANAGEMENT ---
exports.getAllResources = async (req, res, next) => {
  try {
    const result = await db.query(`
      SELECT r.*, 
        COALESCE(u.first_name, 'Admin') as first_name, 
        COALESCE(u.last_name, '') as last_name 
      FROM resources r 
      LEFT JOIN users u ON r.uploaded_by = u.id 
      ORDER BY r.created_at DESC
    `);
    res.json({ success: true, resources: result.rows });
  } catch (error) { next(error); }
};

exports.deleteResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM resources WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Resource not found' });

    await logAdminAction(req.admin.id, 'delete_resource', 'resource', id);
    res.json({ success: true, message: 'Resource deleted' });
  } catch (error) { next(error); }
};

exports.createResource = async (req, res, next) => {
  try {
    const { 
      title, description, file_url, category, file_type, 
      department, semester, resource_type, subject, year, 
      subcategory, company, provider, technology 
    } = req.body;
    
    if (!category) {
      return res.status(400).json({ success: false, message: 'Category is required' });
    }

    const result = await db.query(
      `INSERT INTO resources 
        (title, description, file_url, category, file_type, uploaded_by, is_featured, visibility,
         department, semester, resource_type, subject, year, subcategory, company, provider, technology) 
       VALUES ($1, $2, $3, $4, $5, $6, true, 'public', $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
      [
        title, description, file_url, category, file_type || 'PDF', req.admin.id,
        department || null, semester || null, resource_type || null, subject || null, year || null,
        subcategory || null, company || null, provider || null, technology || null
      ]
    );

    await logAdminAction(req.admin.id, 'create_resource', 'resource', result.rows[0].id, { title, category });
    res.status(201).json({ success: true, resource: result.rows[0] });
  } catch (error) { next(error); }
};

// --- ANNOUNCEMENTS ---
exports.getAnnouncements = async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM announcements ORDER BY created_at DESC');
    res.json({ success: true, announcements: result.rows });
  } catch (error) { next(error); }
};

exports.createAnnouncement = async (req, res, next) => {
  try {
    const { title, content, type, is_pinned } = req.body;
    const result = await db.query(
      'INSERT INTO announcements (title, content, type, is_pinned, author_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, content, type || 'general', is_pinned || false, req.admin.id]
    );
    await logAdminAction(req.admin.id, 'create_announcement', 'announcement', result.rows[0].id, { title });
    res.status(201).json({ success: true, announcement: result.rows[0] });
  } catch (error) { next(error); }
};

// --- REPORTS ---
exports.getReports = async (req, res, next) => {
  try {
    const result = await db.query(`
      SELECT r.*, u.first_name as reporter_first, u.last_name as reporter_last 
      FROM reports r 
      JOIN users u ON r.reporter_id = u.id 
      ORDER BY r.created_at DESC
    `);
    res.json({ success: true, reports: result.rows });
  } catch (error) { next(error); }
};

exports.resolveReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'resolved' or 'rejected'
    
    const result = await db.query(
      'UPDATE reports SET status = $1, resolved_at = CURRENT_TIMESTAMP, resolved_by = $2 WHERE id = $3 RETURNING *',
      [status, req.admin.id, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Report not found' });
    
    await logAdminAction(req.admin.id, 'resolve_report', 'report', id, { new_status: status });
    res.json({ success: true, report: result.rows[0] });
  } catch (error) { next(error); }
};

// --- EVENTS MANAGEMENT ---
exports.getAllEvents = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT e.*, a.email as admin_email
       FROM events e
       JOIN admins a ON e.created_by = a.id
       ORDER BY e.start_date ASC`
    );
    res.json({ success: true, events: result.rows });
  } catch (error) { next(error); }
};

exports.createEvent = async (req, res, next) => {
  try {
    const { title, description, category, venue, start_date, end_date, poster_url, brochure_url, apply_link, capacity } = req.body;

    if (!title || !start_date) {
      return res.status(400).json({ success: false, message: 'Title and start date are required.' });
    }

    const result = await db.query(
      `INSERT INTO events (title, description, category, venue, start_date, end_date, poster_url, brochure_url, apply_link, capacity, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [title, description, category || 'General', venue, start_date, end_date || null, poster_url || null, brochure_url || null, apply_link || null, capacity || null, req.admin.id]
    );

    await logAdminAction(req.admin.id, 'create_event', 'event', result.rows[0].id, { title });
    res.status(201).json({ success: true, event: result.rows[0] });
  } catch (error) { next(error); }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, category, venue, start_date, end_date, poster_url, brochure_url, apply_link, capacity } = req.body;

    const result = await db.query(
      `UPDATE events SET
         title = COALESCE($1, title),
         description = COALESCE($2, description),
         category = COALESCE($3, category),
         venue = COALESCE($4, venue),
         start_date = COALESCE($5, start_date),
         end_date = $6,
         poster_url = $7,
         brochure_url = $8,
         apply_link = $9,
         capacity = $10,
         updated_at = NOW()
       WHERE id = $11 RETURNING *`,
      [title, description, category, venue, start_date, end_date || null, poster_url || null, brochure_url || null, apply_link || null, capacity || null, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Event not found' });

    await logAdminAction(req.admin.id, 'update_event', 'event', id, { title });
    res.json({ success: true, event: result.rows[0] });
  } catch (error) { next(error); }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM events WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Event not found' });

    await logAdminAction(req.admin.id, 'delete_event', 'event', id);
    res.json({ success: true, message: 'Event deleted' });
  } catch (error) { next(error); }
};

