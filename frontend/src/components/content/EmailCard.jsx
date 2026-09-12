const EmailCard = ({ content }) => (
  <div className="space-y-2 text-left">
    <p className="text-sm"><span className="font-semibold">Subject:</span> {content.subject}</p>
    <p className="text-sm whitespace-pre-wrap">{content.body}</p>
  </div>
);

export default EmailCard;
