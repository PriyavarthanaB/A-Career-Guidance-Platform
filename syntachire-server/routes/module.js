const express = require("express");
const router = express.Router();
const { optionalAuth } = require("../middleware/auth");
const { 
  getAllModules, 
  getModuleById, 
  getModuleTheory, 
  markModuleReadingComplete 
} = require("../controllers/moduleController");

// Apply optionalAuth so req.user is set whenever JWT token is present
router.use(optionalAuth);

// Define routes for coding modules
router.route("/").get(getAllModules);
router.route("/:id").get(getModuleById);
router.route("/:id/theory").get(getModuleTheory);
router.route("/:id/complete-reading").post(markModuleReadingComplete);

module.exports = router;
