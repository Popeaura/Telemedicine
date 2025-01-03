const express = require('express');
const mysql = require('mysql2'); // Using mysql2 for better support
const bodyParser = require('body-parser');
const dotenv = require('dotenv'); // For environment variables
const path = require('path');
const bcrypt = require('bcrypt'); // For password hashing
const jwt = require('jsonwebtoken'); // For generating and verifying JWT

// Load environment variables from .env file
dotenv.config();

const app = express();

// Serve static files from the root folder
app.use(express.static(path.join(__dirname, '.')));

// Middleware to parse form data (URL-encoded)
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to parse JSON data
app.use(express.json());

// Set up MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', // Load password from .env
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

// Middleware: Authenticate JWT
const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key');
    req.userId = decoded.id; // Store user ID in request object
    next();
  } catch (error) {
    console.error('Token Verification Error:', error);
    res.status(401).send({ message: 'Invalid token' });
  }
};

// Route: User Registration with bcrypt and accountNumber
app.post('/register', async (req, res) => {
  const { firstname, lastname, age, email, tel, username, password } = req.body;

  if (!firstname || !lastname || !email || !username || !password) {
    return res.status(400).json({ error: 'Please fill in all required fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const accountNumber = `ACC-${Date.now()}`; // Example unique ID

    const query = `
      INSERT INTO users (firstname, lastname, age, email, tel, username, password, account_number) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [firstname, lastname, age, email, tel, username, hashedPassword, accountNumber],
      (err, result) => {
        if (err) {
          console.error('Database Error:', err);

          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'User already exists' });
          }

          return res.status(500).json({ error: 'Error registering user' });
        }

        res.status(201).json({ 
          message: 'User registered successfully!', 
          accountNumber 
        });
      }
    );
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route: User Login with JWT
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) {
        console.error('Database Error:', err);
        return res.status(500).send({ message: 'Database error' });
      }

      if (!results.length) {
        return res.status(404).send({ message: 'User not found' });
      }

      const user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).send({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret-key', { expiresIn: '1h' });

      res.send({ message: 'Login successful', token });
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).send({ message: 'Error logging in' });
  }
});

// Route: Protected Dashboard
app.get('/dashboard', authenticate, (req, res) => {
  res.send({ message: `Welcome to the dashboard, User ID: ${req.userId}!` });
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
