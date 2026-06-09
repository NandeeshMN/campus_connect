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

    console.log('Adding columns to users and posts tables...');
    
    // Add status to users if it doesn't exist
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';
    `);

    // Add is_hidden to posts if it doesn't exist
    await client.query(`
      ALTER TABLE posts 
      ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT FALSE;
    `);

    console.log('Creating new tables...');

    // Reports table
    await client.query(`
      CREATE TABLE IF NOT EXISTS reports (
          id SERIAL PRIMARY KEY,
          reporter_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('user', 'post', 'comment', 'resource')),
          target_id INTEGER NOT NULL,
          reason TEXT NOT NULL,
          status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'rejected')),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          resolved_at TIMESTAMP,
          resolved_by INTEGER REFERENCES admin(id) ON DELETE SET NULL
      );
    `);

    // Announcements table
    await client.query(`
      CREATE TABLE IF NOT EXISTS announcements (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          type VARCHAR(50) DEFAULT 'general',
          is_pinned BOOLEAN DEFAULT FALSE,
          author_id INTEGER REFERENCES admin(id) ON DELETE SET NULL,
          scheduled_for TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Audit logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
          id SERIAL PRIMARY KEY,
          admin_id INTEGER REFERENCES admin(id) ON DELETE SET NULL,
          action VARCHAR(255) NOT NULL,
          target_type VARCHAR(50),
          target_id INTEGER,
          details JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Admin notifications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_notifications (
          id SERIAL PRIMARY KEY,
          type VARCHAR(50) NOT NULL,
          message TEXT NOT NULL,
          reference_id INTEGER,
          reference_type VARCHAR(50),
          is_read BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query('COMMIT');
    console.log('Phase 1 Migration completed successfully.');
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
