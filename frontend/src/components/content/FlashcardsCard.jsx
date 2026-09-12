import { useState } from 'react';
import { RotateCw } from 'lucide-react';

const FlashcardsCard = ({ content }) => {
  const [flipped, setFlipped] = useState({});

  const toggle = (i) => setFlipped((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
      {(content.cards || []).map((card, i) => (
        <button
          key={i}
          onClick={() => toggle(i)}
          className="border rounded-lg p-4 text-left min-h-[100px] flex flex-col justify-between hover:border-primary/50 transition-colors"
        >
          <p className="text-sm">{flipped[i] ? card.back : card.front}</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
            <RotateCw className="w-3 h-3" />
            {flipped[i] ? 'Answer — click to flip back' : 'Click to reveal answer'}
          </div>
        </button>
      ))}
    </div>
  );
};

export default FlashcardsCard;
