const mongoose = require("mongoose");

const theorySectionSchema = new mongoose.Schema(
  {
    sectionId: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    order: { type: Number, required: true },
    estimatedMinutes: { type: Number, default: 10 },
  },
  { _id: false }
);

const dsaModuleSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    order: { type: Number, required: true },
    icon: { type: String, default: "code" },
    faangTags: [{ type: String }],
    theorySections: [theorySectionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("DSAModule", dsaModuleSchema);
