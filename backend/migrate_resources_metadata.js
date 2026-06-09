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

    console.log('Adding new metadata columns to resources table...');
    
    await client.query(`
      ALTER TABLE resources 
      ADD COLUMN IF NOT EXISTS company VARCHAR(255),
      ADD COLUMN IF NOT EXISTS provider VARCHAR(255),
      ADD COLUMN IF NOT EXISTS technology VARCHAR(255);
    `);

    await client.query('COMMIT');
    console.log('Metadata Migration completed successfully.');
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
