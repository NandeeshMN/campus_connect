require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const runMigration = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(`
      ALTER TABLE resources
        ADD COLUMN IF NOT EXISTS category VARCHAR(100),
        ADD COLUMN IF NOT EXISTS subcategory VARCHAR(100),
        ADD COLUMN IF NOT EXISTS department VARCHAR(100),
        ADD COLUMN IF NOT EXISTS semester VARCHAR(50),
        ADD COLUMN IF NOT EXISTS resource_type VARCHAR(50),
        ADD COLUMN IF NOT EXISTS subject VARCHAR(100),
        ADD COLUMN IF NOT EXISTS year VARCHAR(10),
        ADD COLUMN IF NOT EXISTS visibility VARCHAR(20) DEFAULT 'public',
        ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS downloads_count INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `);

    await client.query('COMMIT');
    console.log('Resources table migration completed successfully.');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', e.message);
    process.exit(1);
  } finally {
    client.release();
    pool.end();
  }
};

runMigration();
