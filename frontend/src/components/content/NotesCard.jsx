const NotesCard = ({ content }) => (
  <div className="space-y-4 text-left">
    {content.topics?.map((topic, i) => (
      <div key={i}>
        <h4 className="font-semibold text-sm mb-1">{topic.heading}</h4>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-0.5">
          {topic.points.map((point, j) => (
            <li key={j}>{point}</li>
          ))}
        </ul>
      </div>
    ))}

    {content.keyTerms?.length > 0 && (
      <div>
        <h4 className="font-semibold text-sm mb-1">Key Terms</h4>
        {content.keyTerms.map((term, i) => (
          <p key={i} className="text-sm">
            <span className="font-medium">{term.term}:</span>{' '}
            <span className="text-muted-foreground">{term.definition}</span>
          </p>
        ))}
      </div>
    )}
  </div>
);

export default NotesCard;
