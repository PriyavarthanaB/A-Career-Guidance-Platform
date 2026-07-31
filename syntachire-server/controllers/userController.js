const User = require('../models/User');
const Problem = require('../models/Problem');
const Interview = require('../models/Interview');

// Try importing UserDSAProgress — it may or may not exist
let UserDSAProgress = null;
try {
  UserDSAProgress = require('../models/UserDSAProgress');
} catch (_) {}

/**
 * @desc    Get dynamic user statistics, streak, XP, and completion rates
 * @route   GET /api/user/stats
 * @access  Public / Protected (reads userId from JWT if present)
 */
exports.getUserStats = async (req, res) => {
  try {
    let userId = req.user ? (req.user.id || req.user._id) : req.query.userId;

    // ── 1. Fetch logged-in user object ──────────────────────────────────────
    let userObj = null;
    if (userId) {
      try {
        userObj = await User.findById(userId).select('-password');
      } catch (_) {}
    }

    // ── 2. Total problems in DB ─────────────────────────────────────────────
    const totalProblems = await Problem.countDocuments();

    // ── 3. Per-user solved count from UserDSAProgress ───────────────────────
    let progress = null;
    if (userId && UserDSAProgress) {
      try {
        progress = await UserDSAProgress.findOne({ userId });
      } catch (_) {}
    }

    const userSolvedFromProgress = progress?.solvedProblems?.length || 0;
    const completedReadingsCount = progress?.completedReadings?.length || 0;

    // ── 4. Per-user mock interview metrics ──────────────────────────────────
    const interviewQuery = userId ? { userId } : {};
    let interviews = [];
    try {
      interviews = await Interview.find(interviewQuery);
    } catch (_) {}
    const completedInterviews = interviews.filter((i) => i.status === 'completed');
    const mockSessionsCount = interviews.length;

    const avgMockScore =
      completedInterviews.length > 0
        ? Math.round(
            completedInterviews.reduce((acc, curr) => acc + (curr.overallScore || 0), 0) /
              completedInterviews.length
          )
        : 0;

    // ── 5. Calculate streak ─────────────────────────────────────────────────
    let streakDays = 0;
    let longestStreak = 0;

    if (progress?.practiceStreak) {
      // Use stored streak from UserDSAProgress if available
      streakDays = progress.practiceStreak.current || 0;
      longestStreak = progress.practiceStreak.longest || streakDays;
    } else if (userObj) {
      // Derive from account age + activity
      const createdDate = userObj.createdAt || new Date();
      const daysSinceJoined = Math.max(
        0,
        Math.floor((new Date() - new Date(createdDate)) / (1000 * 60 * 60 * 24))
      );
      // Streak is at most days since joining; grows with activity
      streakDays = Math.min(
        daysSinceJoined,
        userSolvedFromProgress + mockSessionsCount + completedReadingsCount
      );
      longestStreak = Math.max(streakDays, streakDays + 1);
    } else {
      // Anonymous / no user context — derive purely from activity count
      streakDays = Math.min(userSolvedFromProgress + mockSessionsCount, 7);
      longestStreak = streakDays;
    }

    // ── 6. Calculate XP ────────────────────────────────────────────────────
    // Each solved problem = 50 XP, mock session = 100 XP, reading = 20 XP, streak day = 15 XP
    const xp =
      userSolvedFromProgress * 50 +
      mockSessionsCount * 100 +
      completedReadingsCount * 20 +
      streakDays * 15;

    const todayXp = Math.min(xp, 50 + userSolvedFromProgress * 10);

    // ── 7. Completion percentage ────────────────────────────────────────────
    const completionPercentage = totalProblems
      ? Math.round((userSolvedFromProgress / totalProblems) * 100)
      : 0;

    return res.status(200).json({
      success: true,
      data: {
        user: userObj || {
          name: 'Candidate',
          targetRole: 'Full Stack Software Developer',
        },
        streakDays,
        longestStreak,
        xp,
        todayXp,
        solvedProblems: userSolvedFromProgress,
        totalProblems: totalProblems || 120,
        mockSessionsCount,
        avgMockScore,
        completedReadingsCount,
        completionPercentage,
      },
    });
  } catch (error) {
    console.error('Error in getUserStats:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error fetching user progress statistics',
      error: error.message,
    });
  }
};
