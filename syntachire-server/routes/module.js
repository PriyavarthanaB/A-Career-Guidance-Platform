const express = require("express");
const router = express.Router();
const { getAllModules, getModuleById, getModuleTheory } = require("../controllers/moduleController");

// Define routes for coding modules
router.route("/").get(getAllModules);
router.route("/:id").get(getModuleById);
router.route("/:id/theory").get(getModuleTheory);

module.exports = router;
