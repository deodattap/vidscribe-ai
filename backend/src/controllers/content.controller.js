import Video from '../models/Video.js';
import Transcript from '../models/Transcript.js';
import GeneratedContent from '../models/GeneratedContent.js';
import { generateContent } from '../services/ai.service.js';
import { CONTENT_TYPES, isValidContentType, getPublicContentTypes } from '../config/contentTypes.js';
import asyncHandler from '../utils/asyncHandler.js';

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

const runGeneration = async (type, transcriptText, params) => {
  const config = CONTENT_TYPES[type];
  let result = await generateContent(type, transcriptText, params);
  if (config.postProcess) {
    result = config.postProcess(result);
  }
  return result;
};

// @desc    List all available content types, grouped for the frontend's
//          content-pack selector. Keeps the type list defined in exactly
//          one place (config/contentTypes.js) instead of duplicated in
//          the frontend too.
// @route   GET /api/content/types
export const listContentTypes = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, types: getPublicContentTypes() });
});

// @desc    Generate (or regenerate) one content type for a video, with
//          optional generation parameters (word count, tone, audience,
//          language, custom instructions, regenerate variant).
// @route   POST /api/content/:type
// @body    { videoId, params?: { wordCount, tone, audience, language, customInstructions, regenerateOption } }
export const generateVideoContent = asyncHandler(async (req, res) => {
  const { type } = req.params;
  const { videoId, params = {} } = req.body;

  if (!isValidContentType(type)) {
    res.status(400);
    throw new Error(`Unsupported content type: ${type}`);
  }

  const { transcript } = await getVideoAndTranscript(videoId, req.user.id);
  const result = await runGeneration(type, transcript.rawText, params);

  const content = await GeneratedContent.findOneAndUpdate(
    { video: videoId, type },
    { video: videoId, user: req.user.id, type, content: result, params },
    { upsert: true, new: true }
  );

  res.status(201).json({ success: true, content });
});

// @desc    Generate multiple content types for a video in one request —
//          powers the "Content Pack" multi-select UI. Runs sequentially
//          (not Promise.all) to stay well within the free-tier AI rate
//          limit rather than firing a burst of parallel requests.
// @route   POST /api/content/batch
// @body    { videoId, types: string[], params?: {...} }
export const generateBatchContent = asyncHandler(async (req, res) => {
  const { videoId, types, params = {} } = req.body;

  if (!Array.isArray(types) || types.length === 0) {
    res.status(400);
    throw new Error('Provide a non-empty array of content types to generate');
  }

  const invalidTypes = types.filter((t) => !isValidContentType(t));
  if (invalidTypes.length > 0) {
    res.status(400);
    throw new Error(`Unsupported content type(s): ${invalidTypes.join(', ')}`);
  }

  const { transcript } = await getVideoAndTranscript(videoId, req.user.id);

  const results = [];
  for (const type of types) {
    try {
      const result = await runGeneration(type, transcript.rawText, params);
      const content = await GeneratedContent.findOneAndUpdate(
        { video: videoId, type },
        { video: videoId, user: req.user.id, type, content: result, params },
        { upsert: true, new: true }
      );
      results.push({ type, success: true, content });
    } catch (err) {
      // One failing type shouldn't abort the whole pack — record the
      // failure and keep going, so the user still gets everything else.
      results.push({ type, success: false, message: err.message });
    }
  }

  res.status(201).json({ success: true, results });
});

// @desc    Manually edit and save a piece of already-generated content
//          (e.g. the user tweaks the AI's output by hand).
// @route   PUT /api/content/item/:id
// @body    { content }
export const updateGeneratedContentItem = asyncHandler(async (req, res) => {
  const { content: newContent } = req.body;

  if (newContent === undefined || newContent === null || newContent === '') {
    res.status(400);
    throw new Error('Content is required');
  }

  const item = await GeneratedContent.findOne({ _id: req.params.id, user: req.user.id });
  if (!item) {
    res.status(404);
    throw new Error('Generated content not found');
  }

  item.content = newContent;
  await item.save();

  res.status(200).json({ success: true, content: item });
});
