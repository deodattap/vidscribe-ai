import { useState, useMemo } from 'react';
import { Layers, Loader2, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useContentTypes } from '../../hooks/useContentTypes';
import { useGenerateBatchContent } from '../../hooks/useGenerateContent';
import { useToast } from '../../context/ToastContext';

/**
 * "Generate a Pack" — pick several formats and generate them together.
 * Each format is a clickable, clearly-highlighted chip (not a tiny
 * checkbox easy to miss), so it's obvious at a glance what's selected.
 */
const ContentPackSelector = ({ videoId, params }) => {
  const { data } = useContentTypes();
  const { mutate: generateBatch, isPending } = useGenerateBatchContent(videoId);
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);

  const grouped = useMemo(() => {
    if (!data?.types) return {};
    return data.types.reduce((acc, t) => {
      acc[t.categoryLabel] = acc[t.categoryLabel] || [];
      acc[t.categoryLabel].push(t);
      return acc;
    }, {});
  }, [data]);

  const toggle = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleCategory = (types) => {
    const ids = types.map((t) => t.id);
    const allSelected = ids.every((id) => selected.includes(id));
    setSelected((prev) =>
      allSelected ? prev.filter((id) => !ids.includes(id)) : [...new Set([...prev, ...ids])]
    );
  };

  const handleGenerate = () => {
    if (selected.length === 0) return;
    generateBatch(
      { types: selected, params },
      {
        onSuccess: (data) => {
          const failed = data.results.filter((r) => !r.success);
          if (failed.length > 0) {
            showToast(
              `Generated ${data.results.length - failed.length}/${data.results.length}. Failed: ${failed.map((f) => f.type).join(', ')}`,
              'error'
            );
          } else {
            showToast(`Generated ${data.results.length} formats`);
          }
          setSelected([]);
          setOpen(false);
        },
        onError: (err) => {
          showToast(err.response?.data?.message || 'Failed to generate content pack', 'error');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Layers className="w-3.5 h-3.5" />
          Generate a pack
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate multiple formats at once</DialogTitle>
          <DialogDescription>
            Tap to select the formats you want, then generate them all together using your current customization settings.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {Object.entries(grouped).map(([category, types]) => (
            <div key={category}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-muted-foreground">{category}</h4>
                <button
                  className="text-xs text-primary underline underline-offset-2"
                  onClick={() => toggleCategory(types)}
                  type="button"
                >
                  {types.every((t) => selected.includes(t.id)) ? 'Deselect all' : 'Select all'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {types.map((t) => {
                  const isSelected = selected.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => toggle(t.id)}
                      aria-pressed={isSelected}
                      className={`flex items-center justify-between gap-2 text-sm text-left px-3 py-2 rounded-md border transition-colors ${
                        isSelected
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-transparent border-input hover:bg-secondary/60'
                      }`}
                    >
                      <span>{t.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button onClick={handleGenerate} disabled={selected.length === 0 || isPending} className="w-full sm:w-auto">
            {isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</>
            ) : (
              <><Sparkles className="w-4 h-4 mr-2" />Generate {selected.length > 0 ? `${selected.length} ` : ''}selected</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContentPackSelector;
