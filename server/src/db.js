const { Pool } = require('pg');
require('dotenv').config();

// A "pool" is a set of database connections that the server reuses
// instead of creating a new connection every time
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

module.exports = pool;
