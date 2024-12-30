const express = require('express');
const app = express();
const mysql = require('mysql2');  // Using mysql2 for better support
const bodyParser = require('body-parser');

// Middleware to parse form data (for URL-encoded data)
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to parse JSON data (for any JSON request payload)
app.use(express.json());

// Set up MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'telemedicine_db'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Failed to connect to database:', err);
    return;
  }
  console.log('Connected to MySQL database!');
});

// Handle POST request for user registration
app.post('/add-user', (req, res) => {
  const { firstname, lastname, age, email, tel, username, password } = req.body;

  // Basic validation (you can add more validation based on your needs)
  if (!firstname || !lastname || !email || !password || !username) {
    return res.status(400).send('Please fill in all required fields');
  }

  // SQL query to insert user data into the database
  const query = 'INSERT INTO users (firstname, lastname, age, email, tel, username, password) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [firstname, lastname, age, email, tel, username, password], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).send('Error adding user');
    }

    console.log('User added:', result);
    res.status(200).send('User registered successfully!');
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
