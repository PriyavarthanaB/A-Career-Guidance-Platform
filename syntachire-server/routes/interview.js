const express = require('express');
const router = express.Router();
const {
  startInterview,
  evaluateAnswer,
  getInterviewById,
  submitAnswer,
  finishInterview,
  getUserInterviews,
} = require('../controllers/interviewController');

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

// ─── INTERVIEW ROUTES ───

// POST /api/interview/start - Initialize new interview session
router.post('/start', optionalAuth, startInterview);

// POST /api/interview/evaluate - Standalone answer evaluation via Gemini API
router.post('/evaluate', optionalAuth, evaluateAnswer);

// GET /api/interview/history - Fetch past interviews
router.get('/history', optionalAuth, getUserInterviews);

// GET /api/interview/:id - Fetch interview by ID
router.get('/:id', optionalAuth, getInterviewById);

// POST /api/interview/:id/submit - Submit response for a question and evaluate
router.post('/:id/submit', optionalAuth, submitAnswer);

// PATCH /api/interview/:id/finish - Complete interview session
router.patch('/:id/finish', optionalAuth, finishInterview);

module.exports = router;
