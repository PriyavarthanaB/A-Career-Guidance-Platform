const express = require("express");
const router = express.Router();
const { optionalAuth } = require("../middleware/auth");
const {
  getAllProblems,
  getProblemById,
  updateProblemStatus,
  getProblemsByModule,
  toggleBookmark,
} = require("../controllers/problemController");

// Apply optionalAuth to all problem routes so req.user is set whenever a token is present
router.use(optionalAuth);

// Module-specific problems route → GET /api/problems/module/:id
router.route("/module/:id").get(getProblemsByModule);

// General problem routes
router.route("/").get(getAllProblems);
router.route("/:id").get(getProblemById).patch(updateProblemStatus);

// Bookmark route
router.route("/:id/bookmark").patch(toggleBookmark);

module.exports = router;