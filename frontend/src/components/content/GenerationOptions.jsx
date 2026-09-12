import { useState } from 'react';
import { Settings2 } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const WORD_COUNT_PRESETS = [300, 500, 1000, 1500, 2000];
const TONES = ['Neutral', 'Casual', 'Professional', 'Persuasive', 'Enthusiastic', 'Formal'];
const LANGUAGES = ['English', 'Hindi', 'Marathi'];

/**
 * Always-visible, compact generation-parameters bar. Every generate/
 * regenerate call on this page uses whatever is set here — no hidden
 * panel, no extra click required to find it.
 */
const GenerationOptions = ({ params, onChange }) => {
  const update = (patch) => onChange({ ...params, ...patch });

  const activeCount = ['wordCount', 'tone', 'audience', 'language', 'customInstructions'].filter(
    (k) => params[k]
  ).length;

  return (
    <div className="flex flex-wrap items-center gap-2 py-3 border-b">
      <span className="text-sm font-medium flex items-center gap-1.5 text-muted-foreground shrink-0">
        <Settings2 className="w-4 h-4" />
        Customize:
      </span>

      <Select
        value={params.wordCount ? String(params.wordCount) : ''}
        onValueChange={(v) => update({ wordCount: v ? Number(v) : undefined })}
      >
        <SelectTrigger size="sm" className="w-[110px]">
          <SelectValue placeholder="Length" />
        </SelectTrigger>
        <SelectContent>
          {WORD_COUNT_PRESETS.map((w) => (
            <SelectItem key={w} value={String(w)}>{w} words</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={params.tone || ''} onValueChange={(v) => update({ tone: v })}>
        <SelectTrigger size="sm" className="w-[120px]">
          <SelectValue placeholder="Tone" />
        </SelectTrigger>
        <SelectContent>
          {TONES.map((t) => (
            <SelectItem key={t} value={t}>{t}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={params.language || 'English'} onValueChange={(v) => update({ language: v })}>
        <SelectTrigger size="sm" className="w-[110px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {LANGUAGES.map((l) => (
            <SelectItem key={l} value={l}>{l}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        placeholder="Audience"
        value={params.audience || ''}
        onChange={(e) => update({ audience: e.target.value })}
        className="h-8 w-[130px] text-sm"
      />

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            More instructions
            {params.customInstructions && <Badge variant="secondary" className="ml-1 px-1">1</Badge>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <label className="text-sm font-medium mb-1 block">Custom instructions</label>
          <Textarea
            placeholder="e.g. focus on the practical steps, avoid jargon, include a call to action"
            value={params.customInstructions || ''}
            onChange={(e) => update({ customInstructions: e.target.value })}
            rows={3}
          />
        </PopoverContent>
      </Popover>

      {activeCount > 0 && (
        <button
          className="text-xs text-muted-foreground underline"
          onClick={() => onChange({})}
          type="button"
        >
          Reset
        </button>
      )}
    </div>
  );
};

export default GenerationOptions;
