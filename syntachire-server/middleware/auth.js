// middleware/auth.js
const jwt = require('jsonwebtoken');

/**
 * Strict authentication middleware. Rejects requests without valid JWT.
 */
const auth = function (req, res, next) {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader;

  if (!token) {
    return res.status(401).json({ message: 'Token missing, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = decoded.user || decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid or has expired' });
  }
};

/**
 * Optional authentication middleware. Attaches req.user if token is valid,
 * but proceeds without error if token is missing or invalid.
 */
const optionalAuth = function (req, res, next) {
  const authHeader = req.header('Authorization');
  if (authHeader) {
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        req.user = decoded.user || decoded;
      } catch (_) {}
    }
  }
  next();
};

module.exports = auth;
module.exports.auth = auth;
module.exports.optionalAuth = optionalAuth;