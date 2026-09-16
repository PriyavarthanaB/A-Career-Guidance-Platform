const { getRoadmapForRole, ROLE_ROADMAPS } = require("../services/roleRoadmapService");

// GET /api/roadmap - Get role-specific learning roadmap based on user role or query param
exports.getRoleRoadmap = async (req, res) => {
  try {
    let targetRole = req.query.role || req.params.role;

    if (!targetRole && req.user && req.user.targetRole) {
      targetRole = req.user.targetRole;
    }

    if (!targetRole) {
      targetRole = "Full Stack Software Developer";
    }

    const roadmapData = getRoadmapForRole(targetRole);

    res.status(200).json({
      success: true,
      data: roadmapData,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Could not fetch role-specific learning roadmap",
      error: err.message,
    });
  }
};

// GET /api/roadmap/roles - List all supported roles
exports.getAllAvailableRoles = async (req, res) => {
  try {
    const roles = Object.keys(ROLE_ROADMAPS).map((key) => ({
      id: key,
      title: ROLE_ROADMAPS[key].role,
      description: ROLE_ROADMAPS[key].description,
      moduleCount: ROLE_ROADMAPS[key].recommendedModules.length,
      skills: ROLE_ROADMAPS[key].requiredSkills,
    }));

    res.status(200).json({
      success: true,
      data: roles,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Could not fetch available roles",
      error: err.message,
    });
  }
};
