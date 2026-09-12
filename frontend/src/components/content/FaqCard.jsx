const FaqCard = ({ content }) => (
  <div className="space-y-3 text-left">
    {(content.faqs || []).map((faq, i) => (
      <div key={i}>
        <p className="font-medium text-sm">{faq.question}</p>
        <p className="text-sm text-muted-foreground">{faq.answer}</p>
      </div>
    ))}
  </div>
);

export default FaqCard;
