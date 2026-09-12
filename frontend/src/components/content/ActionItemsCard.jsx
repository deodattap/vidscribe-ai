import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

const ActionItemsCard = ({ content }) => {
  const [checked, setChecked] = useState({});

  const toggle = (i) => setChecked((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <div className="space-y-2 text-left">
      {(content.actionItems || []).map((item, i) => (
        <label key={i} className="flex items-start gap-2 text-sm cursor-pointer">
          <Checkbox checked={!!checked[i]} onCheckedChange={() => toggle(i)} className="mt-0.5" />
          <span className={checked[i] ? 'line-through text-muted-foreground' : ''}>{item}</span>
        </label>
      ))}
    </div>
  );
};

export default ActionItemsCard;
