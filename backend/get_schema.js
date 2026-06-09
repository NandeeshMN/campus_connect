require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const getColumns = async (tableName) => {
  const res = await pool.query(
    "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1",
    [tableName]
  );
  return res.rows;
};

(async () => {
  try {
    const usersCols = await getColumns('users');
    console.log("USERS TABLE:");
    console.log(JSON.stringify(usersCols, null, 2));
    
    const settingsCols = await getColumns('user_settings');
    console.log("USER_SETTINGS TABLE:");
    console.log(JSON.stringify(settingsCols, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
