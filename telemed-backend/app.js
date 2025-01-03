const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, '.')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'telemed_db'
});

db.connect((err) => {
  if (err) {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database!');
});

const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key');
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error('Token Verification Error:', error);
    res.status(401).send({ message: 'Invalid token' });
  }
};

app.post('/register', async (req, res) => {
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

      res.send({ 
        message: 'Login successful', 
        token,
        accountNumber: user.account_number
      });
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).send({ message: 'Error logging in' });
  }
});

app.get('/patient-data', authenticate, (req, res) => {
  // Fetch patient data from the database
  db.query('SELECT * FROM users WHERE id = ?', [req.userId], (err, results) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ error: 'Error fetching patient data' });
    }

    if (!results.length) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const user = results[0];

    // Mock data for demonstration purposes
    const patientData = {
      name: `${user.firstname} ${user.lastname}`,
      age: user.age,
      avatarUrl: 'https://i.pravatar.cc/150?img=4',
      gender: 'Male',
      bloodType: 'O+',
      allergies: ['Milk', 'Penicillin'],
      diseases: ['Diabetes', 'Blood Disorders'],
      height: 176,
      weight: 75,
      patientId: user.account_number,
      lastVisit: '2023-05-15',
      heartRate: 80,
      temperature: 36.5,
      glucose: 100,
      testReports: [
        { title: 'CT Scan - Full Body', date: '2023-02-12', color: 'blue', icon: 'description' },
        { title: 'Creatine Kinase T', date: '2023-02-08', color: 'yellow', icon: 'science' },
        { title: 'Eye Fluorescein Test', date: '2023-02-05', color: 'red', icon: 'visibility' }
      ],
      prescriptions: [
        { title: 'Heart Diseases', date: '2022-10-25', duration: '3 months' },
        { title: 'Skin Care', date: '2022-08-08', duration: '2 months' }
      ]
    };

    res.json(patientData);
  });
});

app.post('/update-patient-info', authenticate, (req, res) => {
  const { height, weight } = req.body;

  db.query(
    'UPDATE users SET height = ?, weight = ? WHERE id = ?',
    [height, weight, req.userId],
    (err, result) => {
      if (err) {
        console.error('Database Error:', err);
        return res.status(500).json({ error: 'Error updating patient info' });
      }

      res.json({ message: 'Patient info updated successfully' });
    }
  );
});

app.post('/add-prescription', authenticate, (req, res) => {
  const { title, duration } = req.body;
  const date = new Date().toISOString().split('T')[0];

  db.query(
    'INSERT INTO prescriptions (user_id, title, date, duration) VALUES (?, ?, ?, ?)',
    [req.userId, title, date, duration],
    (err, result) => {
      if (err) {
        console.error('Database Error:', err);
        return res.status(500).json({ error: 'Error adding prescription' });
      }

      res.json({ message: 'Prescription added successfully' });
    }
  );
});

app.get('/notifications', authenticate, (req, res) => {
  // Mock notifications for demonstration purposes
  const notifications = [
    { id: 1, message: 'Your next appointment is tomorrow at 10:00 AM', date: '2023-05-20' },
    { id: 2, message: 'New test results are available', date: '2023-05-18' },
    { id: 3, message: 'Remember to take your medication', date: '2023-05-17' }
  ];

  res.json(notifications);
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});