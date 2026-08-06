import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get dashboard summary stats for the logged-in user
// @route   GET /api/dashboard/stats
export const getDashboardStats = asyncHandler(async (req, res) => {
  // TODO: replace with real aggregation once Video/GeneratedContent models exist (Phase 4/5)
  res.status(200).json({
    success: true,
    stats: {
      videosProcessed: 0,
      blogsGenerated: 0,
      totalContentGenerated: 0,
    },
    recentActivity: [],
  });
});