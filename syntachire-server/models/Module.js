const mongoose = require("mongoose");

const patternSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
  },
  { _id: false }
);

const complexitySchema = new mongoose.Schema(
  {
    op: { type: String, required: true },
    time: { type: String, required: true },
    space: { type: String, required: true },
  },
  { _id: false }
);

const codeExampleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    code: { type: String, required: true },
    explanation: { type: String },
  },
  { _id: false }
);

const interviewQuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    optimalComplexity: { type: String },
  },
  { _id: false }
);

const commonMistakeSchema = new mongoose.Schema(
  {
    mistake: { type: String, required: true },
    solution: { type: String, required: true },
  },
  { _id: false }
);

// NEW: one multiple-choice quiz question
const quizQuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
    explanation: { type: String },
  },
  { _id: false }
);

const theorySchema = new mongoose.Schema(
  {
    overview: { type: String, required: true },
    learningObjectives: [{ type: String }],
    theoryText: { type: String, required: true },
    patterns: [patternSchema],
    complexities: [complexitySchema],
    codeExamples: [codeExampleSchema],
    importantNotes: [{ type: String }],
    interviewQuestions: [interviewQuestionSchema],
    commonMistakes: [commonMistakeSchema],
    summary: { type: String, required: true },
    codeLanguage: { type: String, default: "javascript" },
    code: { type: String }, // For backwards compatibility

    // NEW fields for richer / interactive learning content
    realWorldApplications: [{ type: String }],
    keyTakeaways: [{ type: String }],
    quiz: [quizQuestionSchema],
  },
  { _id: false }
);

const moduleSchema = new mongoose.Schema(
  {
    number: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    topic: { type: String, required: true },
    difficulty: { type: String, required: true },
    estimatedTime: { type: String, required: true },
    progress: { type: Number, default: 0 },
    description: { type: String, required: true },
    theory: theorySchema,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Module", moduleSchema);