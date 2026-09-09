import { Document, Packer, Paragraph, HeadingLevel } from 'docx';
import Video from '../models/Video.js';
import GeneratedContent from '../models/GeneratedContent.js';
import asyncHandler from '../utils/asyncHandler.js';
import { toMarkdown, typeLabels } from '../utils/contentFormatter.js';

const getContentOrThrow = async (videoId, type, userId) => {
  const video = await Video.findOne({ _id: videoId, user: userId });
  if (!video) {
    const error = new Error('Video not found');
    error.statusCode = 404;
    throw error;
  }

  const generated = await GeneratedContent.findOne({ video: videoId, type });
  if (!generated) {
    const error = new Error(`No ${type} content has been generated for this video yet`);
    error.statusCode = 404;
    throw error;
  }

  return { video, generated };
};

const filenameFor = (video, type, ext) => {
  const label = typeLabels[type] || type;
  const safeId = video.videoId || 'video';
  return `VidScribe-${label}-${safeId}.${ext}`;
};

// @desc    Export generated content as a Markdown file
// @route   GET /api/export/:videoId/:type/markdown
export const exportMarkdown = asyncHandler(async (req, res) => {
  const { videoId, type } = req.params;
  const { video, generated } = await getContentOrThrow(videoId, type, req.user.id);

  const markdown = toMarkdown(type, generated.content);

  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filenameFor(video, type, 'md')}"`);
  res.status(200).send(markdown);
});

// @desc    Export generated content as a Word (.docx) file
// @route   GET /api/export/:videoId/:type/docx
export const exportDocx = asyncHandler(async (req, res) => {
  const { videoId, type } = req.params;
  const { video, generated } = await getContentOrThrow(videoId, type, req.user.id);

  const markdown = toMarkdown(type, generated.content);

  // Simple, reliable markdown -> docx paragraph conversion:
  // headings (#, ##, ###) become heading paragraphs, everything else is body text.
  const paragraphs = markdown.split('\n').map((line) => {
    if (line.startsWith('### ')) {
      return new Paragraph({ text: line.slice(4), heading: HeadingLevel.HEADING_3 });
    }
    if (line.startsWith('## ')) {
      return new Paragraph({ text: line.slice(3), heading: HeadingLevel.HEADING_2 });
    }
    if (line.startsWith('# ')) {
      return new Paragraph({ text: line.slice(2), heading: HeadingLevel.HEADING_1 });
    }
    return new Paragraph({ text: line });
  });

  const doc = new Document({
    sections: [{ properties: {}, children: paragraphs }],
  });

  const buffer = await Packer.toBuffer(doc);

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  );
  res.setHeader('Content-Disposition', `attachment; filename="${filenameFor(video, type, 'docx')}"`);
  res.status(200).send(buffer);
});
