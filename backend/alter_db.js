require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function alterDb() {
  try {
    await pool.query(`
      ALTER TABLE messages 
      ADD COLUMN IF NOT EXISTS message_type VARCHAR(50) DEFAULT 'text',
      ADD COLUMN IF NOT EXISTS shared_post_id INTEGER REFERENCES posts(id) ON DELETE SET NULL;
    `);
    console.log('ALTER done');
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
alterDb();
