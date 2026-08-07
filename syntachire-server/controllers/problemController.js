const Problem = require("../models/Problem");
const UserDSAProgress = require("../models/UserDSAProgress");

// Helper function to extract solved problem IDs for a logged-in user
async function getUserSolvedProblemIds(userId) {
  if (!userId) return new Set();
  try {
    const progress = await UserDSAProgress.findOne({ userId });
    if (!progress || !progress.solvedProblems) return new Set();
    return new Set(progress.solvedProblems.map((sp) => sp.problemId.toString()));
  } catch (_) {
    return new Set();
  }
}

// Helper to format a problem object with per-user solved status
function formatProblemForUser(problem, solvedSet) {
  const obj = problem.toObject ? problem.toObject() : { ...problem };
  const idStr = obj._id.toString();
  obj.status = solvedSet.has(idStr) ? "solved" : "unsolved";
  return obj;
}

// GET /api/problems - Get all problems with per-user solved status
exports.getAllProblems = async (req, res) => {
  try {
    const userId = req.user ? (req.user.id || req.user._id) : null;
    const solvedSet = await getUserSolvedProblemIds(userId);

    const problems = await Problem.find().sort({ order: 1 });
    const formatted = problems.map((p) => formatProblemForUser(p, solvedSet));

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/problems/:id - Get a single problem by ID with per-user solved status
exports.getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: `Problem not found with id of ${req.params.id}`,
      });
    }

    const userId = req.user ? (req.user.id || req.user._id) : null;
    const solvedSet = await getUserSolvedProblemIds(userId);
    const formatted = formatProblemForUser(problem, solvedSet);

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error: Could not fetch coding problem",
      error: err.message,
    });
  }
};

// PATCH /api/problems/:id - Update problem status (solved / unsolved) per user
exports.updateProblemStatus = async (req, res) => {
  try {
    const problemId = req.params.id;
    const newStatus = req.body.status;
    const userId = req.user ? (req.user.id || req.user._id) : null;

    // 1. If user is logged in, update UserDSAProgress
    if (userId && newStatus === "solved") {
      await UserDSAProgress.findOneAndUpdate(
        { userId },
        {
          $addToSet: {
            solvedProblems: { problemId, solvedAt: new Date() },
          },
        },
        { upsert: true, new: true }
      );
    }

    // 2. Return updated status object
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }

    const formatted = problem.toObject();
    formatted.status = newStatus;

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/problems/module/:id - Get coding problems associated with a specific module ID
exports.getProblemsByModule = async (req, res) => {
  try {
    const userId = req.user ? (req.user.id || req.user._id) : null;
    const solvedSet = await getUserSolvedProblemIds(userId);

    const problems = await Problem.find({ moduleId: req.params.id }).sort({ order: 1 });
    const formatted = problems.map((p) => formatProblemForUser(p, solvedSet));

    res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
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
