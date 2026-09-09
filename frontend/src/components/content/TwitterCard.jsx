const TwitterCard = ({ content }) => {
  const tweets = Array.isArray(content?.tweets) ? content.tweets : null;

  if (!tweets) {
    // Defensive fallback: if the AI response didn't come back in the
    // expected { tweets: [...] } shape, show whatever we got rather than
    // crashing the whole tab.
    return (
      <p className="text-sm whitespace-pre-wrap text-left text-muted-foreground">
        {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
      </p>
    );
  }

  return (
    <div className="space-y-3 text-left">
      {tweets.map((tweet, i) => (
        <div key={i} className="border rounded-lg p-3 text-sm">
          <span className="text-muted-foreground text-xs">{i + 1}/{tweets.length}</span>
          <p>{tweet}</p>
        </div>
      ))}
    </div>
  );
};

export default TwitterCard;
