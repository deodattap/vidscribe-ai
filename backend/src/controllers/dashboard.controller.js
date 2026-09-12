import Video from '../models/Video.js';
import GeneratedContent from '../models/GeneratedContent.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get dashboard summary stats for the logged-in user
// @route   GET /api/dashboard/stats
export const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const [videosProcessed, blogsGenerated, totalContentGenerated, recentVideos] = await Promise.all([
    Video.countDocuments({ user: userId, status: 'completed' }),
    GeneratedContent.countDocuments({ user: userId, type: 'blog' }),
    GeneratedContent.countDocuments({ user: userId }),
    Video.find({ user: userId }).sort({ createdAt: -1 }).limit(5),
  ]);

  const recentActivity = recentVideos.map((v) => ({
    id: v._id,
    youtubeUrl: v.youtubeUrl,
    videoId: v.videoId,
    status: v.status,
    wordCount: v.wordCount,
    createdAt: v.createdAt,
  }));

  res.status(200).json({
    success: true,
    stats: {
      videosProcessed,
      blogsGenerated,
      totalContentGenerated,
    },
    recentActivity,
  });
});
