const mysql = require('mysql2');
require('dotenv').config(); // Load environment variables

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'telemed_db',
});

connection.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('Connected to the MySQL database!');
  }
});

module.exports = connection;
