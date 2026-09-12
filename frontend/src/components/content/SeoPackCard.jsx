import { Badge } from '@/components/ui/badge';

const SeoPackCard = ({ content }) => (
  <div className="space-y-4 text-left">
    <div>
      <h4 className="font-semibold text-sm mb-1">Keywords</h4>
      <div className="flex flex-wrap gap-1">
        {(content.keywords || []).map((k, i) => (
          <Badge key={i} variant="secondary">{k}</Badge>
        ))}
      </div>
    </div>

    <div>
      <h4 className="font-semibold text-sm mb-1">Title Options</h4>
      <ul className="text-sm space-y-1 list-disc list-inside">
        {(content.titleOptions || []).map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    </div>

    <div>
      <h4 className="font-semibold text-sm mb-1">Meta Description Options</h4>
      <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
        {(content.metaDescriptions || []).map((m, i) => <li key={i}>{m}</li>)}
      </ul>
    </div>

    <div>
      <h4 className="font-semibold text-sm mb-1">Hashtags</h4>
      <p className="text-sm text-muted-foreground">{(content.hashtags || []).join(' ')}</p>
    </div>
  </div>
);

export default SeoPackCard;
