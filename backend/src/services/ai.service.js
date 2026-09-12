import 'dotenv/config';
import OpenAI from 'openai';
import { CONTENT_TYPES, isValidContentType } from '../config/contentTypes.js';

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

const MODEL = 'openai/gpt-oss-20b';

const REGENERATE_INSTRUCTIONS = {
  shorter: 'Make this noticeably shorter and more concise than a typical response, while keeping the key information.',
  detailed: 'Make this more detailed and thorough than a typical response, expanding on the key points.',
  simpler: 'Use simpler, more accessible language — avoid jargon, write as if explaining to someone new to the topic.',
  professional: 'Use a more formal, professional tone and polished phrasing.',
};

/**
 * Builds the full prompt for a given content type, incorporating the
 * transcript plus any generation parameters the user supplied. This is the
 * one place that knows how to turn (type + params) into an instruction —
 * every content type flows through here instead of having its own
 * hand-written prompt function.
 */
const buildPrompt = (type, transcriptText, params = {}) => {
  const config = CONTENT_TYPES[type];
  const { wordCount, tone, audience, language, customInstructions, regenerateOption } = params;

  const lines = [
    `You are an expert content creator. Based on the following YouTube video transcript, ${config.instructions}`,
  ];

  if (config.supportsWordCount && wordCount) {
    lines.push(`Target length: approximately ${wordCount} words.`);
  }

  if (tone) {
    lines.push(`Tone: ${tone}.`);
  }

  if (audience) {
    lines.push(`Target audience: ${audience}.`);
  }

  if (language && language.toLowerCase() !== 'english') {
    lines.push(`Write the entire response in ${language}, not English.`);
  }

  if (regenerateOption && REGENERATE_INSTRUCTIONS[regenerateOption]) {
    lines.push(REGENERATE_INSTRUCTIONS[regenerateOption]);
  }

  if (customInstructions) {
    lines.push(`Additional instructions from the user: ${customInstructions}`);
  }

  lines.push('Base everything strictly on the transcript content below — do not invent facts that are not present in it.');

  if (config.responseFormat === 'json') {
    lines.push(
      'Respond with ONLY valid JSON (no markdown code fences, no explanation before or after) in exactly this shape:',
      config.jsonShape
    );
  }

  lines.push(`\nTranscript:\n"""\n${transcriptText.slice(0, 12000)}\n"""`);

  return lines.join('\n');
};

/**
 * Generates content for any registered content type. Single entry point —
 * adding a new type to config/contentTypes.js is enough for it to work
 * here automatically, no new function needed.
 */
export const generateContent = async (type, transcriptText, params = {}) => {
  if (!isValidContentType(type)) {
    const error = new Error(`Unsupported content type: ${type}`);
    error.statusCode = 400;
    throw error;
  }

  const config = CONTENT_TYPES[type];
  const prompt = buildPrompt(type, transcriptText, params);

  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content:
          'You are a precise, reliable content generation assistant. When asked for JSON, you return only valid JSON with no extra commentary or markdown fences.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: config.temperature ?? 0.6,
  });

  const responseText = completion.choices?.[0]?.message?.content?.trim();

  if (!responseText) {
    const error = new Error(`AI returned an empty response for ${config.label}`);
    error.statusCode = 502;
    throw error;
  }

  if (config.responseFormat === 'text') {
    return responseText;
  }

  // JSON responseFormat: parse defensively, stripping accidental code fences
  const cleaned = responseText.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error(`${config.label} AI response was not valid JSON:`, responseText);
    const error = new Error(`AI returned invalid JSON for ${config.label}. Please try regenerating.`);
    error.statusCode = 502;
    throw error;
  }
};
