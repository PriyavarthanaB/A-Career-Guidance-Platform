const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    category: { type: String, default: 'General' },
    hint: { type: String },
    userAnswer: { type: String, default: '' },
    score: { type: Number, default: 0 },
    strengths: { type: String, default: '' },
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
      enum: ['hr', 'technical', 'mixed'],
      required: true,
      default: 'mixed',
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
      default: 'Medium',
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
    summary: {
      type: String,
      default: '',
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
