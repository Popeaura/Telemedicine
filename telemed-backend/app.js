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
  user: 'root',  // Your MySQL username
  password: 'pop3_lumar21',  // Replace with your MySQL password
  database: 'telemed_db'
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
app.post('/register', (req, res) => {
  const { firstname, lastname, age, email, tel, username, password } = req.body;

  if (!firstname || !lastname || !email || !username || !password) {
    return res.status(400).send('Please fill in all required fields');
  }

  const query = 'INSERT INTO users (firstname, lastname, age, email, tel, username, password) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [firstname, lastname, age, email, tel, username, password], (err, result) => {
    if (err) {
      console.error('Database Error:', err); // Log detailed error
      return res.status(500).send('Error registering user');
    }

    console.log('User registered:', result);
    res.status(200).send('User registered successfully!');
  });
});


// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
