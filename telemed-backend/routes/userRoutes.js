const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Assuming you're using a separate db configuration file
const authenticate = require('../middleware/auth');

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  const { firstname, lastname, age, email, tel, username, password } = req.body;

  if (!firstname || !lastname || !email || !username || !password) {
    return res.status(400).json({ error: 'Please fill in all required fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const accountNumber = `ACC-${Date.now()}`;

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
        res.status(201).json({ success: true, message: 'User registered successfully!', accountNumber });
      }
    );
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
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

      res.send({
        success: true,
        message: 'Login successful',
        token,
        accountNumber: user.account_number,
      });
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).send({ message: 'Error logging in' });
  }
});

// Patient Data Route
router.get('/patient-data', authenticate, (req, res) => {
  db.query('SELECT * FROM users WHERE id = ?', [req.userId], (err, results) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ error: 'Error fetching patient data' });
    }

    if (!results.length) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const user = results[0];
    const patientData = {
      name: `${user.firstname} ${user.lastname}`,
      age: user.age,
      email: user.email,
      tel: user.tel,
      patientId: user.account_number,
    };

    res.json({ success: true, data: patientData });
  });
});

module.exports = router;
