const mongoose = require("mongoose");

const exampleSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    output: { type: String, required: true },
    explanation: { type: String, default: "" },
  },
  { _id: false }
);

const solutionSchema = new mongoose.Schema(
  {
    overview: { type: String, default: "" },
    timeComplexity: { type: String, default: "O(N)" },
    spaceComplexity: { type: String, default: "O(1)" },
    pythonCode: { type: String, default: "" },
    jsCode: { type: String, default: "" },
    javaCode: { type: String, default: "" },
    cppCode: { type: String, default: "" },
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
    solution: solutionSchema,
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
