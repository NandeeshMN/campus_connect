require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const seedAdmin = async () => {
  const client = await pool.connect();
  try {
    const adminEmail = 'admin@campusconnect.com';
    const adminPassword = 'adminpassword123'; // The initial password
    const adminName = 'System Administrator';

    // Check if admin already exists
    const checkRes = await client.query('SELECT * FROM admin WHERE email = $1', [adminEmail]);
    if (checkRes.rows.length > 0) {
      console.log('Admin user already exists. Skipping seed.');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);

    await client.query(
      'INSERT INTO admin (full_name, email, password_hash) VALUES ($1, $2, $3)',
      [adminName, adminEmail, passwordHash]
    );

    console.log('Admin user seeded successfully!');
    console.log('-----------------------------');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('-----------------------------');
  } catch (e) {
    console.error('Seeding failed:', e.message);
    process.exit(1);
  } finally {
    client.release();
    pool.end();
  }
};

seedAdmin();
