const db = require('../config/db');

// GET /api/resources — list with search, filter, sort
const getResources = async (req, res, next) => {
  try {
    const {
      search = '',
      category,
      subcategory,
      department,
      semester,
      subject,
      year,
      resource_type,
      is_featured,
      sort = 'newest',
      limit = 50,
      offset = 0,
    } = req.query;

    const conditions = ["visibility = 'public'"];
    const values = [];
    let idx = 1;

    if (search) {
      conditions.push(`(title ILIKE $${idx} OR description ILIKE $${idx})`);
      values.push(`%${search}%`);
      idx++;
    }
    if (category) { conditions.push(`category = $${idx++}`); values.push(category); }
    if (subcategory) { conditions.push(`subcategory = $${idx++}`); values.push(subcategory); }
    if (department) { conditions.push(`department = $${idx++}`); values.push(department); }
    if (semester) { conditions.push(`semester = $${idx++}`); values.push(semester); }
    if (subject) { conditions.push(`subject = $${idx++}`); values.push(subject); }
    if (year) { conditions.push(`year = $${idx++}`); values.push(year); }
    if (resource_type) { conditions.push(`resource_type = $${idx++}`); values.push(resource_type); }
    if (is_featured === 'true') { conditions.push(`is_featured = TRUE`); }

    const orderMap = {
      newest: 'created_at DESC',
      oldest: 'created_at ASC',
      most_downloaded: 'downloads_count DESC',
      most_viewed: 'views_count DESC',
      featured: 'is_featured DESC, created_at DESC',
    };
    const orderBy = orderMap[sort] || 'created_at DESC';

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    values.push(parseInt(limit), parseInt(offset));

    const query = `
      SELECT r.*, u.full_name as uploader_name, u.username as uploader_username
      FROM resources r
      LEFT JOIN users u ON r.uploaded_by = u.id
      ${where}
      ORDER BY ${orderBy}
      LIMIT $${idx} OFFSET $${idx + 1}
    `;

    const countQuery = `SELECT COUNT(*) FROM resources r ${where}`;
    const [result, countResult] = await Promise.all([
      db.query(query, values),
      db.query(countQuery, values.slice(0, -2)),
    ]);

    res.json({
      success: true,
      resources: result.rows,
      total: parseInt(countResult.rows[0].count),
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/resources/:id
const getResourceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT r.*, u.full_name as uploader_name, u.username as uploader_username
       FROM resources r
       LEFT JOIN users u ON r.uploaded_by = u.id
       WHERE r.id = $1 AND r.visibility = 'public'`,
      [id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }
    res.json({ success: true, resource: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

// POST /api/resources/:id/view
const incrementView = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query('UPDATE resources SET views_count = views_count + 1 WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

// POST /api/resources/:id/download
const incrementDownload = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query('UPDATE resources SET downloads_count = downloads_count + 1 WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

// POST /api/resources — Admin upload
const createResource = async (req, res, next) => {
  try {
    const {
      title, description, file_url, file_type, category, subcategory,
      department, semester, resource_type, subject, year, visibility,
      is_featured
    } = req.body;

    const result = await db.query(
      `INSERT INTO resources
        (title, description, file_url, file_type, category, subcategory, department,
         semester, resource_type, subject, year, visibility, is_featured, uploaded_by,
         views_count, downloads_count, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,0,0,NOW(),NOW())
       RETURNING *`,
      [title, description, file_url, file_type, category, subcategory, department,
       semester, resource_type, subject, year, visibility || 'public',
       is_featured || false, req.user.id]
    );

    res.status(201).json({ success: true, resource: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

// PUT /api/resources/:id — Admin edit
const updateResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title, description, file_url, file_type, category, subcategory,
      department, semester, resource_type, subject, year, visibility, is_featured
    } = req.body;

    const result = await db.query(
      `UPDATE resources SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        file_url = COALESCE($3, file_url),
        file_type = COALESCE($4, file_type),
        category = COALESCE($5, category),
        subcategory = COALESCE($6, subcategory),
        department = COALESCE($7, department),
        semester = COALESCE($8, semester),
        resource_type = COALESCE($9, resource_type),
        subject = COALESCE($10, subject),
        year = COALESCE($11, year),
        visibility = COALESCE($12, visibility),
        is_featured = COALESCE($13, is_featured),
        updated_at = NOW()
       WHERE id = $14
       RETURNING *`,
      [title, description, file_url, file_type, category, subcategory, department,
       semester, resource_type, subject, year, visibility, is_featured, id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }
    res.json({ success: true, resource: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/resources/:id — Admin delete
const deleteResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM resources WHERE id = $1', [id]);
    res.json({ success: true, message: 'Resource deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getResources,
  getResourceById,
  incrementView,
  incrementDownload,
  createResource,
  updateResource,
  deleteResource,
};
