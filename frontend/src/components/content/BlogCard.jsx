import { Badge } from '@/components/ui/badge';

const BlogCard = ({ content }) => (
  <div className="space-y-4 text-left">
    <div>
      <h3 className="font-bold text-lg">{content.title}</h3>
      <p className="text-sm text-muted-foreground">{content.metaDescription}</p>
      <div className="flex gap-2 mt-2">
        <Badge variant="secondary">{content.readingTime} min read</Badge>
        <Badge variant="secondary">{content.wordCount} words</Badge>
      </div>
    </div>

    <div className="text-sm whitespace-pre-wrap">{content.content}</div>

    {content.faqs?.length > 0 && (
      <div>
        <h4 className="font-semibold mb-2">FAQs</h4>
        <div className="space-y-2">
          {content.faqs.map((faq, i) => (
            <div key={i}>
              <p className="font-medium text-sm">{faq.question}</p>
              <p className="text-sm text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default BlogCard;
