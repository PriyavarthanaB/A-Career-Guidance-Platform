const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    category: { type: String, default: 'General' },
    hint: { type: String },
    userAnswer: { type: String, default: '' },
    audioUrl: { type: String, default: '' },
    answerStartedAt: { type: Date },
    answerEndedAt: { type: Date },
    durationMs: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    technicalScore: { type: Number, default: 0 },
    problemSolvingScore: { type: Number, default: 0 },
    communicationScore: { type: Number, default: 0 },
    relevanceScore: { type: Number, default: 0 },
    confidenceScore: { type: Number, default: 0 },
    aiFeedback: { type: String, default: '' },
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    missingPoints: { type: [String], default: [] },
    improvements: { type: String, default: '' },
  },
  { _id: true }
);

const InterviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    type: {
      type: String,
      enum: ['hr', 'technical', 'behavioral', 'mixed'],
      required: true,
      default: 'mixed',
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
      default: 'Medium',
    },
    durationMinutes: {
      type: Number,
      default: 30,
    },
    targetRole: {
      type: String,
      required: true,
      default: 'Full Stack Software Developer',
    },
    responseMode: {
      type: String,
      enum: ['text', 'voice'],
      default: 'text',
    },
    questionCount: {
      type: Number,
      default: 5,
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed', 'cancelled'],
      default: 'in-progress',
    },
    questions: [QuestionSchema],
    overallScore: {
      type: Number,
      default: 0,
    },
    overallTechnicalScore: {
      type: Number,
      default: 0,
    },
    overallProblemSolvingScore: {
      type: Number,
      default: 0,
    },
    overallCommunicationScore: {
      type: Number,
      default: 0,
    },
    overallRelevanceScore: {
      type: Number,
      default: 0,
    },
    overallConfidenceScore: {
      type: Number,
      default: 0,
    },
    overallTimeManagementScore: {
      type: Number,
      default: 0,
    },
    totalDurationMs: {
      type: Number,
      default: 0,
    },
    summary: {
      type: String,
      default: '',
    },
    strongestTopics: {
      type: [String],
      default: [],
    },
    weakestTopics: {
      type: [String],
      default: [],
    },
    personalizedFeedback: {
      type: String,
      default: '',
    },
    recommendedTopics: {
      type: [String],
      default: [],
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Interview', InterviewSchema);
