const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  startInterview,
  evaluateAnswer,
  getInterviewById,
  submitAnswer,
  generateNextQuestion,
  finishInterview,
  getUserInterviews,
  getUserProgress,
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

const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads', 'interviews'));
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .slice(0, 60);
    const timestamp = Date.now();
    const interviewId = req.params.id || 'session';
    const ext = path.extname(safeName) || '.webm';
    cb(null, `${interviewId}-${timestamp}-${safeName}${ext}`);
  },
});

const audioUpload = multer({
  storage: audioStorage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio recording uploads are allowed.'));
    }
  },
});

// ─── INTERVIEW ROUTES ───

// POST /api/interview/start - Initialize new interview session
router.post('/start', optionalAuth, startInterview);

// POST /api/interview/evaluate - Standalone answer evaluation via Gemini API
router.post('/evaluate', optionalAuth, evaluateAnswer);

// GET /api/interview/progress - Analytics & progress metrics across interviews
router.get('/progress', optionalAuth, getUserProgress);

// GET /api/interview/history - Fetch past interviews
router.get('/history', optionalAuth, getUserInterviews);

// GET /api/interview/:id - Fetch interview by ID
router.get('/:id', optionalAuth, getInterviewById);

// POST /api/interview/:id/submit - Submit response for a question and evaluate
router.post('/:id/submit', optionalAuth, audioUpload.single('recording'), submitAnswer);

// POST /api/interview/:id/next-question - Generate next single dynamic question
router.post('/:id/next-question', optionalAuth, generateNextQuestion);

// PATCH /api/interview/:id/finish - Complete interview session
router.patch('/:id/finish', optionalAuth, finishInterview);

module.exports = router;
