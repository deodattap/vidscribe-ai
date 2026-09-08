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

/**
 * Generates a full SEO blog post with structured fields from a transcript.
 */
export const generateBlog = async (transcriptText) => {
  const prompt = `You are an expert SEO content writer. Based on the following YouTube video transcript, generate a complete blog post.

Respond with ONLY valid JSON (no markdown fences, no explanation) in exactly this shape:
{
  "title": "SEO-friendly title, under 70 characters",
  "metaDescription": "Compelling meta description, 140-160 characters",
  "slug": "url-friendly-slug-based-on-title",
  "content": "Full blog body in Markdown, using ## for H2 and ### for H3 headings, well-structured with an intro, 3-5 main sections, and a conclusion",
  "faqs": [
    { "question": "A relevant question readers might have", "answer": "A concise answer" }
  ]
}

Include 3-4 FAQs. Base everything strictly on the transcript content — do not invent facts not present in it.

Transcript:
"""
${transcriptText.slice(0, 12000)}
"""`;

  const completion = await openai.chat.completions.create({
  model: MODEL,
  messages: [{ role: 'user', content: prompt }],
  temperature: 0.6,
  });

  const parsed = JSON.parse(completion.choices[0].message.content);
  return parsed;
};