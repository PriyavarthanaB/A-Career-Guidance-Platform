const express = require("express");
const router = express.Router();
const {
  getAllProblems,
  getProblemById,
  updateProblemStatus,
  getProblemsByModule,
  toggleBookmark,
} = require("../controllers/problemController");

// ─── IMPORTANT: Specific routes MUST come before parameterised /:id routes ───

// Module-specific problems route  →  GET /api/problems/module/:id
router.route("/module/:id").get(getProblemsByModule);

// General problem routes
router.route("/").get(getAllProblems);
router.route("/:id").get(getProblemById).patch(updateProblemStatus);

// Bookmark route
router.route("/:id/bookmark").patch(toggleBookmark);

module.exports = router;