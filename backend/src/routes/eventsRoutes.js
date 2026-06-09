const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticate } = require('../middleware/authMiddleware');

// GET /api/events — Public route for students to view events
router.get('/', authenticate, async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT id, title, description, category, venue, start_date, end_date, poster_url, brochure_url, apply_link, capacity, created_at
       FROM events
       WHERE start_date >= NOW() - INTERVAL '1 day'
       ORDER BY start_date ASC`
    );
    res.json({ success: true, events: result.rows });
  } catch (error) { next(error); }
});

module.exports = router;
