import mongoose from 'mongoose';
import Video from '../models/Video.js';
import GeneratedContent from '../models/GeneratedContent.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get content-type breakdown and activity-over-time for the logged-in user
// @route   GET /api/analytics
export const getAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const objectId = new mongoose.Types.ObjectId(userId);

  const contentByType = await GeneratedContent.aggregate([
    { $match: { user: objectId } },
    { $group: { _id: '$type', count: { $sum: 1 } } },
    { $project: { _id: 0, type: '$_id', count: 1 } },
  ]);

  const videosByStatus = await Video.aggregate([
    { $match: { user: objectId } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
    { $project: { _id: 0, status: '$_id', count: 1 } },
  ]);

  // Videos processed per day, last 14 days
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  const videosOverTime = await Video.aggregate([
    { $match: { user: objectId, createdAt: { $gte: fourteenDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $project: { _id: 0, date: '$_id', count: 1 } },
    { $sort: { date: 1 } },
  ]);

  res.status(200).json({
    success: true,
    contentByType,
    videosByStatus,
    videosOverTime,
  });
});
