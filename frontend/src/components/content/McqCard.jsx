import { useState } from 'react';

const McqCard = ({ content }) => {
  const [revealed, setRevealed] = useState({});

  const toggle = (i) => setRevealed((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <div className="space-y-4 text-left">
      {content.questions?.map((q, i) => (
        <div key={i} className="border rounded-lg p-3">
          <p className="font-medium text-sm mb-2">{i + 1}. {q.question}</p>
          <div className="space-y-1">
            {q.options.map((opt, j) => (
              <div
                key={j}
                className={`text-sm px-2 py-1 rounded ${
                  revealed[i] && j === q.correctAnswer ? 'bg-green-100 dark:bg-green-900/30 font-medium' : ''
                }`}
              >
                {opt}
              </div>
            ))}
          </div>
          <button
            onClick={() => toggle(i)}
            className="text-xs text-muted-foreground underline mt-2"
          >
            {revealed[i] ? 'Hide answer' : 'Show answer'}
          </button>
          {revealed[i] && (
            <p className="text-xs text-muted-foreground mt-1">{q.explanation}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default McqCard;
