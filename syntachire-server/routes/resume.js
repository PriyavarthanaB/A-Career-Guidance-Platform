const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParseModule = require('pdf-parse');
const pdfParse = typeof pdfParseModule === 'function' ? pdfParseModule : pdfParseModule.default;
const { GoogleGenAI } = require('@google/genai');
const Resume = require('../models/Resume');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// 1. Setup Multer with file filter for PDFs (max 10MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF documents are allowed.'));
    }
  },
});

// 2. Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn('Warning: GEMINI_API_KEY is not defined in environment variables.');
}
const ai = new GoogleGenAI({ apiKey });

// POST /api/resume/analyze
router.post('/analyze', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a valid PDF resume file.' });
    }

    const userDoc = await User.findById(req.user.id);
    const targetRole = req.body.targetRole || userDoc?.targetRole || 'Backend Developer';

    // Extract text from PDF buffer
    let resumeText = '';
    try {
      const pdfData = await pdfParse(req.file.buffer);
      resumeText = pdfData.text;
    } catch (parseErr) {
      return res.status(400).json({ error: 'Failed to read the PDF file. Please ensure it is not password protected.' });
    }

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ error: 'Could not extract readable text from the uploaded PDF.' });
    }

    const prompt = `
    You are an expert HR and ATS reviewer.
    Analyze the following resume for the target role: "${targetRole}".

    Resume Text:
    """
    ${resumeText}
    """

    Provide a JSON evaluation with keys:
    - atsScore: An integer from 0 to 100 based on ATS match.
    - extractedSkills: An array of key technical and soft skills found.
    - missingSkills: An array of important missing skills for the "${targetRole}" role.
    - suggestions: An array of actionable improvements.
    - summary: A brief summary of the candidate profile.
    `;

    // Query Gemini Model using structured JSON response
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            atsScore: { type: 'INTEGER' },
            extractedSkills: { type: 'ARRAY', items: { type: 'STRING' } },
            missingSkills: { type: 'ARRAY', items: { type: 'STRING' } },
            suggestions: { type: 'ARRAY', items: { type: 'STRING' } },
            summary: { type: 'STRING' },
          },
          required: ['atsScore', 'extractedSkills', 'missingSkills', 'suggestions', 'summary'],
        },
      },
    });

    // Safely parse JSON response
    let parsedData = {};
    try {
      const cleanText = response.text.replace(/```json|```/g, '').trim();
      parsedData = JSON.parse(cleanText);
    } catch (jsonErr) {
      console.error('JSON parsing error from Gemini response:', response.text);
      return res.status(500).json({ error: 'Invalid response format received from AI model.' });
    }

    // Save analysis to MongoDB
    const newResume = new Resume({
      userId: req.user.id,
      fileName: req.file.originalname,
      targetRole: targetRole,
      rawText: resumeText,
      atsScore: parsedData.atsScore ?? 0,
      extractedSkills: parsedData.extractedSkills || [],
      missingSkills: parsedData.missingSkills || [],
      suggestions: parsedData.suggestions || [],
      summary: parsedData.summary || '',
    });

    await newResume.save();

    // Respond back to Frontend
    return res.status(200).json({
      message: 'Resume analyzed successfully!',
      data: newResume,
    });

  } catch (error) {
    console.error('Resume Parsing Error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to analyze resume with AI.',
    });
  }
});

// GET /api/resume/latest
router.get('/latest', auth, async (req, res) => {
  try {
    const latest = await Resume.findOne({ userId: req.user.id }).sort({ analyzedAt: -1 });
    return res.status(200).json({ success: true, data: latest });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/resume/history - Fetch all uploaded resumes for logged-in user
router.get('/history', auth, async (req, res) => {
  try {
    const history = await Resume.find({ userId: req.user.id }).sort({ analyzedAt: -1 });
    return res.status(200).json({ success: true, data: history });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/resume/:id - Delete a stored resume
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Resume record not found.' });
    }
    return res.status(200).json({ success: true, message: 'Resume deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/resume/reanalyze-for-role
router.post('/reanalyze-for-role', auth, async (req, res) => {
  try {
    const { targetRole } = req.body;
    if (!targetRole) {
      return res.status(400).json({ error: 'targetRole is required.' });
    }

    // Update user's targetRole in User collection if logged in
    const User = require('../models/User');
    await User.findByIdAndUpdate(req.user.id, { targetRole });

    // Find user's latest uploaded resume document
    const latestResume = await Resume.findOne({ userId: req.user.id }).sort({ analyzedAt: -1 });

    if (!latestResume || !latestResume.rawText) {
      return res.status(200).json({
        message: 'Target role updated successfully. Upload a resume to analyze against this role.',
        reanalyzed: false,
      });
    }

    // Call Gemini AI to re-analyze rawText for the NEW targetRole
    const prompt = `
    You are an expert HR and ATS reviewer.
    Re-evaluate the following resume for the NEW target role: "${targetRole}".

    Resume Text:
    """
    ${latestResume.rawText}
    """

    Provide a JSON evaluation with keys:
    - atsScore: An integer from 0 to 100 based on ATS match for ${targetRole}.
    - extractedSkills: An array of key technical and soft skills found.
    - missingSkills: An array of important missing skills for the "${targetRole}" role.
    - suggestions: An array of actionable improvements for ${targetRole}.
    - summary: A brief summary of the candidate profile aligned with ${targetRole}.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            atsScore: { type: 'INTEGER' },
            extractedSkills: { type: 'ARRAY', items: { type: 'STRING' } },
            missingSkills: { type: 'ARRAY', items: { type: 'STRING' } },
            suggestions: { type: 'ARRAY', items: { type: 'STRING' } },
            summary: { type: 'STRING' },
          },
          required: ['atsScore', 'extractedSkills', 'missingSkills', 'suggestions', 'summary'],
        },
      },
    });

    let parsedData = {};
    try {
      const cleanText = response.text.replace(/```json|```/g, '').trim();
      parsedData = JSON.parse(cleanText);
    } catch (jsonErr) {
      console.error('JSON parsing error from Gemini response:', response.text);
      return res.status(500).json({ error: 'Failed to re-analyze with AI.' });
    }

    // Create a new Resume analysis record for the new targetRole
    const newResume = new Resume({
      userId: req.user.id,
      fileName: latestResume.fileName,
      rawText: latestResume.rawText,
      atsScore: parsedData.atsScore ?? 0,
      extractedSkills: parsedData.extractedSkills || [],
      missingSkills: parsedData.missingSkills || [],
      suggestions: parsedData.suggestions || [],
      summary: parsedData.summary || '',
    });

    await newResume.save();

    return res.status(200).json({
      message: `Resume automatically re-analyzed for ${targetRole}!`,
      reanalyzed: true,
      data: newResume,
    });
  } catch (error) {
    console.error('Re-analysis error:', error);
    return res.status(500).json({ error: error.message || 'Failed to re-analyze resume.' });
  }
});

// Express Error Handler for Multer upload errors
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

module.exports = router;