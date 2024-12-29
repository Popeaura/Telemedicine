const mysql = require('mysql2');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt'); // Import bcrypt
dotenv.config();

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

const express = require('express');
const app = express();

app.use(express.json());

// Add this section to define the /add-user route
app.post('/add-user', (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).send('Username, password, and role are required!');
  }

  const validRoles = ['admin', 'doctor', 'patient'];
  if (!validRoles.includes(role)) {
    return res.status(400).send('Invalid role! Role must be one of: admin, doctor, patient.');
  }

  // Hash the password before saving it to the database
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err.message);
      return res.status(500).send('Failed to hash password.');
    }

    const query = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
    db.query(query, [username, hashedPassword, role], (err, result) => {
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

// Add this section to define the /login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username and password are required!');
  }

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], (err, result) => {
    if (err) {
      console.error('Error fetching user:', err.message);
      return res.status(500).send('Login failed.');
    }

    if (result.length > 0) {
      bcrypt.compare(password, result[0].password, (err, isMatch) => {
        if (err) {
          console.error('Error comparing password:', err.message);
          return res.status(500).send('Login failed.');
        }

        if (isMatch) {
          res.status(200).send('Login successful!');
          console.log('User logged in successfully.');
        } else {
          res.status(400).send('Incorrect password!');
        }
      });
    } else {
      res.status(404).send('User not found.');
    }
  });
});

// Other routes and server start
app.get('/', (req, res) => {
  res.send('Telemedicine Backend is up and running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = db;
