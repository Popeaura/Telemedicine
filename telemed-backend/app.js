const express = require('express');
const app = express();
const dotenv = require('dotenv');
const db = require('./config/db'); // Import the database connection

dotenv.config(); // Loads environment variables from .env file

// A simple route to check if the server is working
app.get('/', (req, res) => {
  res.send('Telemedicine Backend is up and running!');
});

// Test database connection
app.get('/test-db', (req, res) => {
  db.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
      res.status(500).send('Database connection failed!');
      console.error('Database connection error:', err.message); // Log error for debugging
    } else {
      res.send(`Database is working! The solution is: ${results[0].solution}`);
      console.log('Database test succeeded.'); // Log success for debugging
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
