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

  const responseText = completion.choices?.[0]?.message?.content?.trim();

  if (!responseText) {
    throw new Error('AI returned an empty response for blog generation');
  }

  try {
    return JSON.parse(responseText);
  } catch (error) {
    console.error('Blog AI response:', responseText);
    throw new Error('AI returned invalid JSON for blog generation');
  }
};

/**
 * Generates a LinkedIn post from a transcript.
 */
export const generateLinkedInPost = async (transcriptText) => {
  const prompt = `You are a LinkedIn content expert. Based on this YouTube video transcript, write an engaging LinkedIn post (150-300 words) summarizing the key insight or takeaway. Use a hook opening line, short paragraphs, and end with a question to drive engagement. Include 3-5 relevant hashtags at the end. Write plain text only, no markdown.

Transcript:
"""
${transcriptText.slice(0, 12000)}
"""

LinkedIn Post:`;

  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  return completion.choices[0].message.content.trim();
};

/**
 * Generates an X (Twitter) thread from a transcript.
 */
export const generateTwitterThread = async (transcriptText) => {
  const prompt = `You are a Twitter/X content expert.

Based strictly on the YouTube transcript below, create an engaging Twitter/X thread.

Requirements:
- Create 5 to 8 tweets.
- Every tweet must be under 280 characters.
- The first tweet must be a strong hook.
- Each tweet should communicate one clear idea.
- Keep the thread logical and easy to follow.
- Do not invent facts that are not in the transcript.
- Return ONLY valid JSON.
- Do not use markdown code fences.
- Do not add any explanation before or after the JSON.

Return exactly this format:
{
  "tweets": [
    "First tweet",
    "Second tweet",
    "Third tweet"
  ]
}

Transcript:
"""
${transcriptText.slice(0, 12000)}
"""`;

  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content:
          'You create concise, engaging Twitter/X threads and always return valid JSON when requested.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
  });

  const responseText = completion.choices?.[0]?.message?.content?.trim();

  if (!responseText) {
    throw new Error('AI returned an empty response for Twitter thread');
  }

  try {
    return JSON.parse(responseText);
  } catch (error) {
    console.error('Twitter AI response:', responseText);
    throw new Error('AI returned invalid JSON for Twitter thread');
  }
};

/**
 * Generates structured study notes from a transcript.
 */
export const generateStudyNotes = async (transcriptText) => {
  const prompt = `You are an expert educator. Based on this YouTube video transcript, create structured study notes.

Respond with ONLY valid JSON, no markdown fences, no explanation, in exactly this shape:
{
  "topics": [
    {
      "heading": "Topic or section name",
      "points": ["Key point 1", "Key point 2", "Key point 3"]
    }
  ],
  "keyTerms": [
    { "term": "Important term", "definition": "Brief definition" }
  ]
}

Requirements:
- Cover all major topics from the transcript.
- Make the points clear and useful for studying.
- Include important technical terms where applicable.
- Base everything strictly on the transcript content.
- Do not invent information.
- Return ONLY valid JSON.
- Do not use markdown code fences.
- Do not add any explanation outside the JSON.

Transcript:
"""
${transcriptText.slice(0, 12000)}
"""`;

  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content:
          'You are an expert educator who creates structured study notes and always returns valid JSON when requested.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.4,
  });

  const responseText = completion.choices?.[0]?.message?.content?.trim();

  if (!responseText) {
    throw new Error('AI returned an empty response for study notes');
  }

  try {
    return JSON.parse(responseText);
  } catch (error) {
    console.error('Study notes AI response:', responseText);
    throw new Error('AI returned invalid JSON for study notes');
  }
};

/**
 * Generates multiple-choice questions from a transcript.
 */
export const generateMCQs = async (transcriptText) => {
  const prompt = `You are an expert quiz creator. Based on this YouTube video transcript, create 5 multiple-choice questions to test understanding of the content.

Respond with ONLY valid JSON, no markdown fences, no explanation, in exactly this shape:
{
  "questions": [
    {
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Brief explanation of why this is correct"
    }
  ]
}

Requirements:
- Create exactly 5 questions.
- Each question must have exactly 4 options.
- "correctAnswer" must be a zero-based index from 0 to 3.
- Include a brief explanation for each answer.
- Base all questions strictly on the transcript content.
- Do not invent information.
- Return ONLY valid JSON.
- Do not use markdown code fences.
- Do not add any explanation outside the JSON.

Transcript:
"""
${transcriptText.slice(0, 12000)}
"""`;

  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content:
          'You are an expert quiz creator who creates accurate multiple-choice questions and always returns valid JSON when requested.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.4,
  });

  const responseText = completion.choices?.[0]?.message?.content?.trim();

  if (!responseText) {
    throw new Error('AI returned an empty response for MCQs');
  }

  try {
    return JSON.parse(responseText);
  } catch (error) {
    console.error('MCQ AI response:', responseText);
    throw new Error('AI returned invalid JSON for MCQs');
  }
};