import Video from '../models/Video.js';
import Transcript from '../models/Transcript.js';
import { extractVideoId } from '../utils/youtubeUrl.js';
import { fetchTranscript, cleanTranscript, getWordCount } from '../services/youtube.service.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Process a YouTube URL: fetch, clean, and store its transcript
// @route   POST /api/videos/process
export const processVideo = asyncHandler(async (req, res) => {
  const { url } = req.body;
  const videoId = extractVideoId(url);

  // Avoid reprocessing the same video for the same user
  const existing = await Video.findOne({ user: req.user.id, videoId });
  if (existing) {
    return res.status(200).json({
      success: true,
      message: 'Video already processed',
      video: existing,
    });
  }

  const video = await Video.create({
    user: req.user.id,
    youtubeUrl: url,
    videoId,
    status: 'processing',
  });

  try {
    const segments = await fetchTranscript(videoId);
    const cleanedText = cleanTranscript(segments);
    const wordCount = getWordCount(cleanedText);

    await Transcript.create({ video: video._id, rawText: cleanedText });

    video.status = 'completed';
    video.wordCount = wordCount;
    await video.save();

    res.status(201).json({ success: true, video });
  } catch (error) {
    video.status = 'failed';
    await video.save();
    throw error; // let errorHandler send the proper status/message (422 from youtube.service)
  }
});

// @desc    Get all videos for the logged-in user
// @route   GET /api/videos
export const getVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, videos });
});

// @desc    Get a single video with its transcript
// @route   GET /api/videos/:id
export const getVideoById = asyncHandler(async (req, res) => {
  const video = await Video.findOne({ _id: req.params.id, user: req.user.id });
  if (!video) {
    res.status(404);
    throw new Error('Video not found');
  }

  const transcript = await Transcript.findOne({ video: video._id });

  res.status(200).json({ success: true, video, transcript });
});

// @desc    Delete a video (and its transcript)
// @route   DELETE /api/videos/:id
export const deleteVideo = asyncHandler(async (req, res) => {
  const video = await Video.findOne({ _id: req.params.id, user: req.user.id });
  if (!video) {
    res.status(404);
    throw new Error('Video not found');
  }

  await Transcript.deleteOne({ video: video._id });
  await video.deleteOne();

  res.status(200).json({ success: true, message: 'Video deleted' });
});