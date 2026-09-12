/**
 * Single source of truth for every AI content type VidScribe can generate.
 *
 * Adding a new content type means adding one entry here — no new service
 * function, no new controller branch, no new route. `ai.service.js` reads
 * `instructions` + `responseFormat` to build the prompt and parse the
 * result; `content.controller.js` reads `postProcess` for any
 * server-computed fields (e.g. blog reading time); `contentFormatter.js`
 * reads `category`/`label` for export/display.
 */

import { calculateReadingTime, calculateWordCount } from '../utils/blogHelpers.js';

export const CATEGORIES = {
  repurpose: 'Repurpose',
  social: 'Social Media',
  study: 'Study & Learning',
  seo: 'SEO & Marketing',
};

// responseFormat: 'text' -> plain prose string
//                 'json' -> AI must return JSON matching `jsonShape` (a human-readable
//                           description embedded in the prompt, not a strict schema)
// supportsWordCount: whether a target word count instruction makes sense for this type
export const CONTENT_TYPES = {
  summary: {
    label: 'Summary',
    category: 'repurpose',
    temperature: 0.5,
    responseFormat: 'text',
    supportsWordCount: true,
    defaultWordCount: 200,
    instructions:
      'Summarize the video transcript into a clear, concise summary that captures the key points and main takeaways. Write in plain prose, no headers or bullet points.',
  },

  blog: {
    label: 'SEO Blog',
    category: 'seo',
    temperature: 0.6,
    responseFormat: 'json',
    supportsWordCount: true,
    defaultWordCount: 800,
    instructions:
      'Write a complete, well-structured SEO blog post based on the transcript, with an intro, several main sections using ## and ### headings, and a conclusion.',
    jsonShape: `{
  "title": "SEO-friendly title, under 70 characters",
  "metaDescription": "Compelling meta description, 140-160 characters",
  "slug": "url-friendly-slug-based-on-title",
  "content": "Full blog body in Markdown, using ## for H2 and ### for H3 headings",
  "faqs": [ { "question": "...", "answer": "..." } ]
}`,
    postProcess: (result) => ({
      ...result,
      readingTime: calculateReadingTime(result.content || ''),
      wordCount: calculateWordCount(result.content || ''),
    }),
  },

  linkedin: {
    label: 'LinkedIn Post',
    category: 'social',
    temperature: 0.7,
    responseFormat: 'text',
    supportsWordCount: true,
    defaultWordCount: 200,
    instructions:
      'Write an engaging LinkedIn post summarizing the key insight or takeaway. Use a hook opening line, short paragraphs, and end with a question to drive engagement. Include 3-5 relevant hashtags at the end. Plain text only, no markdown.',
  },

  twitter: {
    label: 'X Thread',
    category: 'social',
    temperature: 0.7,
    responseFormat: 'json',
    supportsWordCount: false,
    instructions:
      'Create an engaging Twitter/X thread of 5 to 8 tweets. Every tweet must be under 280 characters. The first tweet must be a strong hook. Each tweet communicates one clear idea, in logical order.',
    jsonShape: `{ "tweets": ["First tweet", "Second tweet", "..."] }`,
  },

  instagram: {
    label: 'Instagram Caption',
    category: 'social',
    temperature: 0.7,
    responseFormat: 'text',
    supportsWordCount: true,
    defaultWordCount: 120,
    instructions:
      'Write an engaging Instagram caption based on the video. Start with a scroll-stopping first line, keep paragraphs short, and end with 5-8 relevant hashtags on a new line. Plain text only.',
  },

  youtube_description: {
    label: 'YouTube Description',
    category: 'seo',
    temperature: 0.5,
    responseFormat: 'text',
    supportsWordCount: true,
    defaultWordCount: 200,
    instructions:
      'Write an SEO-friendly YouTube video description based on the transcript: an engaging first two lines (shown before "Show more"), a fuller description of what the video covers, and a short list of relevant keywords/tags at the end prefixed with #. Plain text only.',
  },

  email: {
    label: 'Email / Newsletter',
    category: 'repurpose',
    temperature: 0.6,
    responseFormat: 'json',
    supportsWordCount: true,
    defaultWordCount: 300,
    instructions:
      'Write a newsletter-style email repurposing the video content for an email subscriber list, with a compelling subject line and a well-formatted body.',
    jsonShape: `{ "subject": "Email subject line", "body": "Full email body as plain text with paragraph breaks" }`,
  },

  faq: {
    label: 'FAQ',
    category: 'seo',
    temperature: 0.4,
    responseFormat: 'json',
    supportsWordCount: false,
    instructions:
      'Generate a Frequently Asked Questions list based strictly on the transcript content — questions a viewer or reader would plausibly ask, with clear, concise answers.',
    jsonShape: `{ "faqs": [ { "question": "...", "answer": "..." } ] }`,
  },

  key_takeaways: {
    label: 'Key Takeaways',
    category: 'study',
    temperature: 0.4,
    responseFormat: 'json',
    supportsWordCount: false,
    instructions:
      'Extract the 5-8 most important key takeaways from the transcript as a punchy, scannable list. Each takeaway should be one clear sentence.',
    jsonShape: `{ "takeaways": ["First key takeaway", "Second key takeaway", "..."] }`,
  },

  seo_pack: {
    label: 'SEO Pack',
    category: 'seo',
    temperature: 0.4,
    responseFormat: 'json',
    supportsWordCount: false,
    instructions:
      'Generate an SEO metadata pack for this video/content: target keywords, alternative title tag options, meta description options, and relevant hashtags.',
    jsonShape: `{
  "keywords": ["keyword one", "keyword two"],
  "titleOptions": ["Title option 1", "Title option 2", "Title option 3"],
  "metaDescriptions": ["Meta description option 1", "Meta description option 2"],
  "hashtags": ["#tag1", "#tag2"]
}`,
  },

  flashcards: {
    label: 'Flashcards',
    category: 'study',
    temperature: 0.4,
    responseFormat: 'json',
    supportsWordCount: false,
    instructions:
      'Create 6-10 study flashcards from the transcript. Each flashcard has a short question/term on the front and a concise answer/definition on the back.',
    jsonShape: `{ "cards": [ { "front": "Question or term", "back": "Answer or definition" } ] }`,
  },

  action_items: {
    label: 'Action Items',
    category: 'study',
    temperature: 0.4,
    responseFormat: 'json',
    supportsWordCount: false,
    instructions:
      'Extract concrete, actionable action items or steps a viewer could take based on the video content — practical next steps, not vague advice.',
    jsonShape: `{ "actionItems": ["First action item", "Second action item", "..."] }`,
  },

  notes: {
    label: 'Study Notes',
    category: 'study',
    temperature: 0.4,
    responseFormat: 'json',
    supportsWordCount: false,
    instructions:
      'Create structured study notes covering all major topics from the transcript, with clear points useful for studying and important technical terms where applicable.',
    jsonShape: `{
  "topics": [ { "heading": "Topic name", "points": ["Key point 1", "Key point 2"] } ],
  "keyTerms": [ { "term": "Important term", "definition": "Brief definition" } ]
}`,
  },

  mcq: {
    label: 'MCQs',
    category: 'study',
    temperature: 0.4,
    responseFormat: 'json',
    supportsWordCount: false,
    instructions:
      'Create exactly 5 multiple-choice questions to test understanding of the transcript content. Each question must have exactly 4 options, with a zero-based correct answer index and a brief explanation.',
    jsonShape: `{
  "questions": [
    { "question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": 0, "explanation": "..." }
  ]
}`,
  },
};

export const CONTENT_TYPE_KEYS = Object.keys(CONTENT_TYPES);

export const isValidContentType = (type) => Object.prototype.hasOwnProperty.call(CONTENT_TYPES, type);

/**
 * Public shape of the registry served to the frontend via GET /api/content/types
 * — no internal prompt-building details, just what the UI needs to render
 * the content-pack selector and group types by category.
 */
export const getPublicContentTypes = () =>
  CONTENT_TYPE_KEYS.map((key) => ({
    id: key,
    label: CONTENT_TYPES[key].label,
    category: CONTENT_TYPES[key].category,
    categoryLabel: CATEGORIES[CONTENT_TYPES[key].category],
    supportsWordCount: CONTENT_TYPES[key].supportsWordCount,
    defaultWordCount: CONTENT_TYPES[key].defaultWordCount || null,
  }));
