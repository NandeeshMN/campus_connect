require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});
pool.query(`
  SELECT pg_get_constraintdef(c.oid) AS constraint_def
  FROM pg_constraint c
  JOIN pg_class t ON t.oid = c.conrelid
  WHERE t.relname = 'posts' AND c.conname = 'posts_visibility_check';
`).then(res => { console.log(res.rows); pool.end(); }).catch(console.error);
