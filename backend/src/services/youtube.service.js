import { YoutubeTranscript } from 'youtube-transcript';

/**
 * Fetches the raw transcript segments for a given video ID.
 * Throws a descriptive error if the transcript is unavailable
 * (disabled by uploader, no captions, video doesn't exist, etc.)
 */
export const fetchTranscript = async (videoId) => {
  try {
    const segments = await YoutubeTranscript.fetchTranscript(videoId);

    if (!segments || segments.length === 0) {
      const error = new Error('No transcript available for this video');
      error.statusCode = 422;
      throw error;
    }

    return segments; // [{ text, duration, offset }, ...]
  } catch (err) {
    if (err.statusCode) throw err;

    const error = new Error(
      'Could not retrieve transcript. The video may have captions disabled, be private, or not exist.'
    );
    error.statusCode = 422;
    throw error;
  }
};

/**
 * Cleans raw transcript segments into a single readable text block.
 * Removes filler artifacts and normalizes whitespace.
 */
export const cleanTranscript = (segments) => {
  const rawText = segments.map((s) => s.text).join(' ');

  return rawText
    .replace(/\[.*?\]/g, '') // remove [Music], [Applause], etc.
    .replace(/&amp;#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
};

export const getWordCount = (text) => text.split(/\s+/).filter(Boolean).length;