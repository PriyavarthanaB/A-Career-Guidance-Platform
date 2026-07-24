const mongoose = require("mongoose");

const completedReadingSchema = new mongoose.Schema(
  {
    moduleSlug: { type: String, required: true },
    sectionId: { type: String, required: true },
    completedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const solvedProblemSchema = new mongoose.Schema(
  {
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true },
    solvedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const streakSchema = new mongoose.Schema(
  {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastActivityDate: { type: Date, default: null },
  },
  { _id: false }
);

const userDSAProgressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    completedReadings: [completedReadingSchema],
    solvedProblems: [solvedProblemSchema],
    readingStreak: { type: streakSchema, default: () => ({}) },
    practiceStreak: { type: streakSchema, default: () => ({}) },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserDSAProgress", userDSAProgressSchema);
