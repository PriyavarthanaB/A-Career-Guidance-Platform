const mongoose = require("mongoose");

const exampleSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    output: { type: String, required: true },
  },
  { _id: false }
);

const ProblemSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: "Module", index: true },
    moduleSlug: { type: String, required: true, index: true },
    name: { type: String, required: true },
    subtitle: { type: String },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    description: { type: String, required: true },
    examples: [exampleSchema],
    hints: [{ type: String }],
    tags: [{ type: String }],
    companies: [{ type: String }],
    estimatedTime: { type: String, default: "25 mins" },
    isBookmarked: { type: Boolean, default: false },
    status: { type: String, enum: ["unsolved", "solved"], default: "unsolved" },
    order: { type: Number, default: 0 },
    successRate: { type: String, default: "0.0%" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Problem", ProblemSchema);
