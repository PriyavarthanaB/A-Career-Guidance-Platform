const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParseModule = require('pdf-parse');
const pdfParse = typeof pdfParseModule === 'function' ? pdfParseModule : pdfParseModule.default;
const { GoogleGenAI } = require('@google/genai');
const Resume = require('../models/Resume');
const auth = require('../middleware/auth');


const upload = multer({ storage: multer.memoryStorage() });
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });



router.post('/analyze', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a PDF resume file.' });
    }

    const targetRole = req.body.targetRole || 'Full Stack Software Developer';

    // Extract text from PDF
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    const prompt = `
    You are an expert HR and ATS reviewer.
    Analyze the following resume for the target role: "${targetRole}".

    Resume Text:
    """
    ${resumeText}
    """

    Respond ONLY in valid raw JSON with no markdown formatting or extra text:
    {
      "atsScore": 85,
      "extractedSkills": ["React", "Node.js"],
      "missingSkills": ["Docker", "GraphQL"],
      "suggestions": ["Add measurable metrics to past achievements"],
      "summary": "Candidate shows strong experience in full-stack web development."
    }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    // Clean JSON formatting
    let rawText = response.text || '';
    rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();

    const parsedData = JSON.parse(rawText);

    const newResume = new Resume({
      userId: req.user.id,
      fileName: req.file.originalname,
      rawText: resumeText,
      atsScore: parsedData.atsScore,
      extractedSkills: parsedData.extractedSkills,
      missingSkills: parsedData.missingSkills,
      suggestions: parsedData.suggestions,
      summary: parsedData.summary,
    });

    await newResume.save();

    res.status(200).json({
      message: 'Resume analyzed successfully!',
      data: newResume
    });

  } catch (error) {
    console.error('Resume Parsing Error:', error);
    res.status(500).json({ error: 'Failed to analyze resume with AI.', details: error.message });
  }
});

module.exports = router;