import Video from '../models/Video.js';

import Transcript from '../models/Transcript.js';

import GeneratedContent from '../models/GeneratedContent.js';

import {
  generateSummary,
  generateBlog,
  generateLinkedInPost,
  generateTwitterThread,
  generateStudyNotes,
  generateMCQs,
} from '../services/ai.service.js';

import asyncHandler from '../utils/asyncHandler.js';

import {
  calculateReadingTime,
  calculateWordCount,
} from '../utils/blogHelpers.js';

const generatorsByType = {
  linkedin: generateLinkedInPost,
  twitter: generateTwitterThread,
  notes: generateStudyNotes,
  mcq: generateMCQs,
};

const getVideoAndTranscript = async (videoId, userId) => {
  const video = await Video.findOne({ _id: videoId, user: userId });

  if (!video) {
    const error = new Error('Video not found');
    error.statusCode = 404;
    throw error;
  }

  const transcript = await Transcript.findOne({ video: video._id });

  if (!transcript) {
    const error = new Error('Transcript not available for this video');
    error.statusCode = 422;
    throw error;
  }

  return { video, transcript };
};

// @desc    Generate (or regenerate) a summary for a video
// @route   POST /api/content/summary
export const generateVideoSummary = asyncHandler(async (req, res) => {
  const { videoId } = req.body;

  const { transcript } = await getVideoAndTranscript(
    videoId,
    req.user.id
  );

  const summaryText = await generateSummary(transcript.rawText);

  const content = await GeneratedContent.findOneAndUpdate(
    { video: videoId, type: 'summary' },
    {
      video: videoId,
      user: req.user.id,
      type: 'summary',
      content: summaryText,
    },
    { upsert: true, new: true }
  );

  res.status(201).json({
    success: true,
    content,
  });
});

// @desc    Generate (or regenerate) a blog post for a video
// @route   POST /api/content/blog
export const generateVideoBlog = asyncHandler(async (req, res) => {
  const { videoId } = req.body;

  const { transcript } = await getVideoAndTranscript(
    videoId,
    req.user.id
  );

  const blogData = await generateBlog(transcript.rawText);

  const enrichedContent = {
    ...blogData,
    readingTime: calculateReadingTime(blogData.content),
    wordCount: calculateWordCount(blogData.content),
  };

  const content = await GeneratedContent.findOneAndUpdate(
    { video: videoId, type: 'blog' },
    {
      video: videoId,
      user: req.user.id,
      type: 'blog',
      content: enrichedContent,
    },
    { upsert: true, new: true }
  );

  res.status(201).json({
    success: true,
    content,
  });
});

// @desc    Generate LinkedIn/Twitter/Notes/MCQ content for a video
// @route   POST /api/content/:type
export const generateSimpleContent = asyncHandler(async (req, res) => {
  const { type } = req.params;
  const { videoId } = req.body;

  const generator = generatorsByType[type];

  if (!generator) {
    res.status(400);
    throw new Error(`Unsupported content type: ${type}`);
  }

  const { transcript } = await getVideoAndTranscript(
    videoId,
    req.user.id
  );

  const generatedContent = await generator(transcript.rawText);

  const content = await GeneratedContent.findOneAndUpdate(
    { video: videoId, type },
    {
      video: videoId,
      user: req.user.id,
      type,
      content: generatedContent,
    },
    { upsert: true, new: true }
  );

  res.status(201).json({
    success: true,
    content,
  });
});