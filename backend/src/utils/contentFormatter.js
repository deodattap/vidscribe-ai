import { CONTENT_TYPES } from '../config/contentTypes.js';

/**
 * Converts a GeneratedContent document's `content` field into a single
 * Markdown string, based on its `type`. Each type has a different shape
 * (see config/contentTypes.js), so this is the one place that knows how
 * to render all of them consistently for export.
 */
export const toMarkdown = (type, content) => {
  switch (type) {
    case 'summary':
      return `# Summary\n\n${content}\n`;

    case 'blog': {
      const faqSection = (content.faqs || [])
        .map((f) => `### ${f.question}\n\n${f.answer}`)
        .join('\n\n');

      return [
        `# ${content.title}`,
        '',
        `*${content.metaDescription}*`,
        '',
        `**Reading time:** ${content.readingTime} min · **Word count:** ${content.wordCount}`,
        '',
        content.content,
        '',
        faqSection ? '## FAQs\n\n' + faqSection : '',
      ]
        .filter(Boolean)
        .join('\n');
    }

    case 'linkedin':
      return `# LinkedIn Post\n\n${content}\n`;

    case 'instagram':
      return `# Instagram Caption\n\n${content}\n`;

    case 'youtube_description':
      return `# YouTube Description\n\n${content}\n`;

    case 'twitter': {
      const tweets = (content.tweets || [])
        .map((t, i) => `**${i + 1}/${content.tweets.length}**\n\n${t}`)
        .join('\n\n---\n\n');
      return `# X (Twitter) Thread\n\n${tweets}\n`;
    }

    case 'email':
      return `# Email / Newsletter\n\n**Subject:** ${content.subject}\n\n${content.body}\n`;

    case 'faq': {
      const faqs = (content.faqs || [])
        .map((f) => `### ${f.question}\n\n${f.answer}`)
        .join('\n\n');
      return `# FAQ\n\n${faqs}\n`;
    }

    case 'key_takeaways': {
      const items = (content.takeaways || []).map((t) => `- ${t}`).join('\n');
      return `# Key Takeaways\n\n${items}\n`;
    }

    case 'seo_pack': {
      const keywords = (content.keywords || []).join(', ');
      const titles = (content.titleOptions || []).map((t) => `- ${t}`).join('\n');
      const metas = (content.metaDescriptions || []).map((m) => `- ${m}`).join('\n');
      const hashtags = (content.hashtags || []).join(' ');

      return [
        '# SEO Pack',
        '',
        `## Keywords\n\n${keywords}`,
        `## Title Options\n\n${titles}`,
        `## Meta Description Options\n\n${metas}`,
        `## Hashtags\n\n${hashtags}`,
      ].join('\n\n');
    }

    case 'flashcards': {
      const cards = (content.cards || [])
        .map((c, i) => `**${i + 1}. ${c.front}**\n\n${c.back}`)
        .join('\n\n');
      return `# Flashcards\n\n${cards}\n`;
    }

    case 'action_items': {
      const items = (content.actionItems || []).map((a) => `- [ ] ${a}`).join('\n');
      return `# Action Items\n\n${items}\n`;
    }

    case 'notes': {
      const topics = (content.topics || [])
        .map((t) => `## ${t.heading}\n\n${(t.points || []).map((p) => `- ${p}`).join('\n')}`)
        .join('\n\n');
      const terms = (content.keyTerms || [])
        .map((k) => `- **${k.term}**: ${k.definition}`)
        .join('\n');

      return [
        '# Study Notes',
        '',
        topics,
        '',
        terms ? '## Key Terms\n\n' + terms : '',
      ]
        .filter(Boolean)
        .join('\n');
    }

    case 'mcq': {
      const questions = (content.questions || [])
        .map((q, i) => {
          const options = q.options
            .map((opt, j) => `${j === q.correctAnswer ? '- [x]' : '- [ ]'} ${opt}`)
            .join('\n');
          return `**${i + 1}. ${q.question}**\n\n${options}\n\n*Explanation:* ${q.explanation}`;
        })
        .join('\n\n');

      return `# MCQs\n\n${questions}\n`;
    }

    default:
      return typeof content === 'string' ? content : JSON.stringify(content, null, 2);
  }
};

/**
 * Filename-safe labels for each content type, derived from the single
 * content-types registry rather than duplicated here.
 */
export const typeLabels = Object.fromEntries(
  Object.entries(CONTENT_TYPES).map(([key, config]) => [key, config.label.replace(/\s+/g, '-')])
);
