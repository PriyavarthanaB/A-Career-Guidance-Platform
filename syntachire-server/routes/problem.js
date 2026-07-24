const express = require("express");
const router = express.Router();
const {
  getAllProblems,
  getProblemById,
  updateProblemStatus,
  getProblemsByModule,
  toggleBookmark,
} = require("../controllers/problemController");

// General problem routes
router.route("/").get(getAllProblems);
router.route("/:id").get(getProblemById).patch(updateProblemStatus);

// Module-specific problems route
router.route("/module/:id").get(getProblemsByModule);

// Bookmark route
router.route("/:id/bookmark").patch(toggleBookmark);

module.exports = router;