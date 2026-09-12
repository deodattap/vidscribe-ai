const KeyTakeawaysCard = ({ content }) => (
  <ul className="space-y-2 text-left list-disc list-inside text-sm">
    {(content.takeaways || []).map((t, i) => (
      <li key={i}>{t}</li>
    ))}
  </ul>
);

export default KeyTakeawaysCard;
