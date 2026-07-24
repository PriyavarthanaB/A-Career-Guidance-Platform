const Problem = require("../models/Problem");

// GET /api/problems - Get all problems
exports.getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find();
    res.status(200).json(problems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/problems/:id - Get a single problem by ID
exports.getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: `Problem not found with id of ${req.params.id}`,
      });
    }
    res.status(200).json({
      success: true,
      data: problem,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error: Could not fetch coding problem",
      error: err.message,
    });
  }
};

// PATCH /api/problems/:id - Update problem status (solved / unsolved)
exports.updateProblemStatus = async (req, res) => {
  try {
    const updatedProblem = await Problem.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.status(200).json(updatedProblem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/problems/module/:id - Get coding problems associated with a specific module ID
exports.getProblemsByModule = async (req, res) => {
  try {
    const problems = await Problem.find({ moduleId: req.params.id }).sort({ order: 1 });
    res.status(200).json({
      success: true,
      count: problems.length,
      data: problems,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error: Could not fetch problems for this module",
      error: err.message,
    });
  }
};

// PATCH /api/problems/:id/bookmark - Toggle bookmark state for a problem
exports.toggleBookmark = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }
    problem.isBookmarked = !problem.isBookmarked;
    await problem.save();
    res.status(200).json({
      success: true,
      data: problem,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error: Could not toggle bookmark",
      error: err.message,
    });
  }
};
