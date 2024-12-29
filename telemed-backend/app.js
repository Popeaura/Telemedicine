const express = require('express');
const app = express();
const dotenv = require('dotenv');

dotenv.config(); // Loads environment variables from .env file

// A simple route to check if the server is working
app.get('/', (req, res) => {
  res.send('Telemedicine Backend is up and running!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
