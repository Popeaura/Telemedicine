const mysql = require('mysql2');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt'); // Import bcrypt
const express = require('express');
const app = express();
dotenv.config();


const path = require('path');

// Serve static files (like HTML, CSS, JS) from the 'telemed' directory
app.use(express.static(path.join(__dirname, '../telemed')));

// MySQL connection setup
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    throw err;
  }
  console.log('Connected to the MySQL database!');
});

// Middleware to parse incoming form data
app.use(express.urlencoded({ extended: true }));  // For form data (urlencoded)
app.use(express.json());  // For JSON data

// Handle the form submission
app.post('/register', (req, res) => {
  const { firstname, lastname, age, email, tel, username, password } = req.body;

  if (!firstname || !lastname || !age || !email || !tel || !username || !password) {
    return res.status(400).send('All fields are required!');
  }

  // Hash the password before saving it to the database
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err.message);
      return res.status(500).send('Failed to hash password.');
    }

    // SQL query to insert form data into the database
    const query = `INSERT INTO users (firstname, lastname, age, email, tel, username, password) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [firstname, lastname, age, email, tel, username, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error inserting user:', err.message);
        return res.status(500).send('Failed to add user.');
      } else {
        res.status(201).send(`User added successfully with ID: ${result.insertId}`);
        console.log(`User added with ID: ${result.insertId}`);
      }
    });
  });
});

// Serve the index.html page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');  // Assuming index.html is in the root directory
});

// Other routes and server start
app.get('/login', (req, res) => {
  res.send('Login route');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = db;
