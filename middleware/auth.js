const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

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

module.exports = authenticate;
