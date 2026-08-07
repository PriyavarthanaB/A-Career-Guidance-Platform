const Module = require("../models/Module");
const Problem = require("../models/Problem");
const UserDSAProgress = require("../models/UserDSAProgress");

// Helper function to extract user progress map for modules
async function getUserProgressMap(userId) {
  if (!userId) return { solvedProblemsSet: new Set(), completedReadingsSet: new Set() };
  try {
    const progress = await UserDSAProgress.findOne({ userId });
    if (!progress) return { solvedProblemsSet: new Set(), completedReadingsSet: new Set() };

    const solvedProblemsSet = new Set((progress.solvedProblems || []).map((sp) => sp.problemId.toString()));
    const completedReadingsSet = new Set((progress.completedReadings || []).map((cr) => cr.moduleSlug));

    return { solvedProblemsSet, completedReadingsSet };
  } catch (_) {
    return { solvedProblemsSet: new Set(), completedReadingsSet: new Set() };
  }
}

// Format a module with per-user calculated progress percentage
async function formatModuleForUser(moduleDoc, solvedProblemsSet, completedReadingsSet) {
  const obj = moduleDoc.toObject ? moduleDoc.toObject() : { ...moduleDoc };
  const moduleIdStr = obj._id.toString();

  // Find total problems for this module
  const moduleProblems = await Problem.find({ moduleId: obj._id }).select("_id");
  const totalProblems = moduleProblems.length;

  if (totalProblems === 0) {
    obj.progress = completedReadingsSet.has(moduleIdStr) || completedReadingsSet.has(obj.number) ? 100 : 0;
  } else {
    let solvedCount = 0;
    for (const p of moduleProblems) {
      if (solvedProblemsSet.has(p._id.toString())) {
        solvedCount++;
      }
    }
    const isReadingDone = completedReadingsSet.has(moduleIdStr) || completedReadingsSet.has(obj.number);
    // If reading is complete, add 1 bonus unit to progress
    const totalUnits = totalProblems + 1;
    const completedUnits = solvedCount + (isReadingDone ? 1 : 0);

    obj.progress = Math.round((completedUnits / totalUnits) * 100);
    obj.solvedProblemsCount = solvedCount;
    obj.totalProblemsCount = totalProblems;
    obj.isReadingCompleted = isReadingDone;
  }

  return obj;
}

// GET /api/modules - Get all coding modules with per-user progress
exports.getAllModules = async (req, res) => {
  try {
    const userId = req.user ? (req.user.id || req.user._id) : null;
    const { solvedProblemsSet, completedReadingsSet } = await getUserProgressMap(userId);

    const modules = await Module.find().sort({ number: 1 });
    const formatted = [];
    for (const m of modules) {
      formatted.push(await formatModuleForUser(m, solvedProblemsSet, completedReadingsSet));
    }

    res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error: Could not fetch coding modules",
      error: err.message,
    });
  }
};

// GET /api/modules/:id - Get a single module by ID with per-user progress
exports.getModuleById = async (req, res) => {
  try {
    const moduleItem = await Module.findById(req.params.id);
    if (!moduleItem) {
      return res.status(404).json({
        success: false,
        message: `Module not found with id of ${req.params.id}`,
      });
    }

    const userId = req.user ? (req.user.id || req.user._id) : null;
    const { solvedProblemsSet, completedReadingsSet } = await getUserProgressMap(userId);
    const formatted = await formatModuleForUser(moduleItem, solvedProblemsSet, completedReadingsSet);

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error: Could not fetch coding module",
      error: err.message,
    });
  }
};

// GET /api/modules/:id/theory - Get detailed theory for a specific module with per-user reading state
exports.getModuleTheory = async (req, res) => {
  try {
    const currentModule = await Module.findById(req.params.id);
    if (!currentModule) {
      return res.status(404).json({
        success: false,
        message: `Module not found with id of ${req.params.id}`,
      });
    }

    const userId = req.user ? (req.user.id || req.user._id) : null;
    const { solvedProblemsSet, completedReadingsSet } = await getUserProgressMap(userId);
    const formatted = await formatModuleForUser(currentModule, solvedProblemsSet, completedReadingsSet);

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
        module: formatted,
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

// POST /api/modules/:id/complete-reading - Mark a module theory reading as completed for logged-in user
exports.markModuleReadingComplete = async (req, res) => {
  try {
    const moduleId = req.params.id;
    const userId = req.user ? (req.user.id || req.user._id) : null;

    if (userId) {
      const targetModule = await Module.findById(moduleId);
      const slugOrId = targetModule ? targetModule.number : moduleId;

      await UserDSAProgress.findOneAndUpdate(
        { userId },
        {
          $addToSet: {
            completedReadings: { moduleSlug: slugOrId, sectionId: "theory", completedAt: new Date() },
          },
        },
        { upsert: true, new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: "Module reading marked as complete",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error: Could not mark module reading complete",
      error: err.message,
    });
  }
};
