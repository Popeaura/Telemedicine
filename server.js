const express = require('express');
const cors = require('cors'); // Import CORS
const app = express();
const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');
const sequelize = require('./config/database'); // Sequelize instance

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // For parsing application/json

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.send('Welcome to the TeleMed API');
});

// Sync Sequelize models with the database
sequelize.sync()
    .then(() => console.log('Database synchronized'))
    .catch(err => console.error('Unable to synchronize database:', err));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});