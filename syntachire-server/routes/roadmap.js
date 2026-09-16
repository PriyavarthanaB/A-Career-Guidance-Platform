const express = require("express");
const router = express.Router();
const { optionalAuth } = require("../middleware/auth");
const { getRoleRoadmap, getAllAvailableRoles } = require("../controllers/roadmapController");

router.use(optionalAuth);

router.get("/roles", getAllAvailableRoles);
router.get("/", getRoleRoadmap);
router.get("/:role", getRoleRoadmap);

module.exports = router;
