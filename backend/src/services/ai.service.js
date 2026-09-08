import 'dotenv/config';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

const MODEL = 'openai/gpt-oss-20b';

/**
 * Generates a concise summary of a transcript.
 */
export const generateSummary = async (transcriptText) => {
  const prompt = `You are an expert content summarizer. Summarize the following YouTube video transcript into a clear, concise summary (150-250 words) that captures the key points and main takeaways. Write in plain prose, no headers or bullet points.

Transcript:
"""
${transcriptText.slice(0, 12000)}
"""

Summary:`;

  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
  });

  return completion.choices[0].message.content.trim();
};