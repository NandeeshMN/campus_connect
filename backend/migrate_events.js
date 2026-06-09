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
    console.log('Running events table migration...');

    // Drop old events table if it exists (it only had dummy data)
    // and recreate with full admin-managed schema
    await client.query(`
      DROP TABLE IF EXISTS events CASCADE;
    `);

    await client.query(`
      CREATE TABLE events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        category VARCHAR(50) DEFAULT 'General',
        venue VARCHAR(255),
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP,
        poster_url TEXT,
        brochure_url TEXT,
        apply_link TEXT,
        capacity INTEGER,
        created_by INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query('COMMIT');
    console.log('Events migration completed successfully.');
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
