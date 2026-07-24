const Module = require("../models/Module");

// GET /api/modules - Get all coding modules sorted by module number
exports.getAllModules = async (req, res) => {
  try {
    const modules = await Module.find().sort({ number: 1 });
    res.status(200).json({
      success: true,
      count: modules.length,
      data: modules,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error: Could not fetch coding modules",
      error: err.message,
    });
  }
};

// GET /api/modules/:id - Get a single module by ID
exports.getModuleById = async (req, res) => {
  try {
    const moduleItem = await Module.findById(req.params.id);
    if (!moduleItem) {
      return res.status(404).json({
        success: false,
        message: `Module not found with id of ${req.params.id}`,
      });
    }
    res.status(200).json({
      success: true,
      data: moduleItem,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error: Could not fetch coding module",
      error: err.message,
    });
  }
};

// GET /api/modules/:id/theory - Get detailed theory for a specific module, including adjacent module IDs for navigation
exports.getModuleTheory = async (req, res) => {
  try {
    const currentModule = await Module.findById(req.params.id);
    if (!currentModule) {
      return res.status(404).json({
        success: false,
        message: `Module not found with id of ${req.params.id}`,
      });
    }

    // Find adjacent modules for navigation
    const prevModule = await Module.findOne({ number: { $lt: currentModule.number } })
      .sort({ number: -1 })
      .select("_id name");
      
    const nextModule = await Module.findOne({ number: { $gt: currentModule.number } })
      .sort({ number: 1 })
      .select("_id name");

    res.status(200).json({
      success: true,
      data: {
        module: currentModule,
        previousModule: prevModule ? { id: prevModule._id, name: prevModule.name } : null,
        nextModule: nextModule ? { id: nextModule._id, name: nextModule.name } : null,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error: Could not fetch coding module theory",
      error: err.message,
    });
  }
};
