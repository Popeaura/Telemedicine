const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); // For password hashing

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware to parse form data (URL-encoded)
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to parse JSON data
app.use(express.json());

// Set up MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'telemed_db'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Failed to connect to database:', err);
    process.exit(1); // Exit process if database connection fails
  }
  console.log('Connected to MySQL database!');
});

// Route: User Registration
app.post('/register', async (req, res) => {
  const { firstname, lastname, age, email, tel, username, password } = req.body;

  // Validate required fields
  if (!firstname || !lastname || !email || !username || !password) {
    return res.status(400).json({ error: 'Please fill in all required fields' });
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  // Prepare SQL query
  const query = `
    INSERT INTO users (firstname, lastname, age, email, tel, username, password) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  // Execute SQL query
  db.query(query, [firstname, lastname, age, email, tel, username, hashedPassword], (err, result) => {
    if (err) {
      console.error('Database Error:', err);

      // Handle specific MySQL errors
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'User already exists' });
      }

      return res.status(500).json({ error: 'Error registering user' });
    }

    console.log('User registered:', result);
    res.status(201).json({ message: 'User registered successfully!' });
  });
});

// Catch-all route for unmatched endpoints
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
