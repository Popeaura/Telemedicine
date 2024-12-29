const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();  // Load environment variables

// Create the database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    throw err;
  }
  console.log('Connected to the MySQL database!');
});

module.exports = db;
