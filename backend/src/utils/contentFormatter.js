/**
 * Converts a GeneratedContent document's `content` field into a single
 * Markdown string, based on its `type`. Each type has a different shape
 * (see models/GeneratedContent.js), so this is the one place that knows
 * how to render all of them consistently for export.
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

    case 'twitter': {
      const tweets = (content.tweets || [])
        .map((t, i) => `**${i + 1}/${content.tweets.length}**\n\n${t}`)
        .join('\n\n---\n\n');
      return `# X (Twitter) Thread\n\n${tweets}\n`;
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
 * A friendly filename-safe label for each content type, used in downloaded filenames.
 */
export const typeLabels = {
  summary: 'Summary',
  blog: 'Blog',
  linkedin: 'LinkedIn-Post',
  twitter: 'X-Thread',
  notes: 'Study-Notes',
  mcq: 'MCQs',
};
