const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: { type: String, default: 'demo_user' }, // Dynamic with auth later
  fileName: String,
  rawText: String,
  atsScore: Number,
  extractedSkills: [String],
  missingSkills: [String],
  suggestions: [String],
  summary: String,
  analyzedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', resumeSchema);