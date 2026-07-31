const express = require('express');
const router = express.Router();
const { getUserStats } = require('../controllers/userController');

// Optional auth middleware (attaches req.user if token present)
const optionalAuth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (authHeader) {
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader;
    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || 'your_jwt_secret'
        );
        req.user = decoded.user || decoded;
      } catch (_) {}
    }
  }
  next();
};

// GET /api/user/stats - Fetch dynamic statistics for logged-in user
router.get('/stats', optionalAuth, getUserStats);

module.exports = router;
