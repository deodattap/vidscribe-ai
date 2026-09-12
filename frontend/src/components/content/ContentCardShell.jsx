import { useState } from 'react';
import { Sparkles, Loader2, Copy, Pencil, Check, X, ChevronDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import ExportButtons from './ExportButtons';
import { copyContentAsText } from '../../services/export.service';
import { updateContentItem } from '../../services/content.service';
import { useToast } from '../../context/ToastContext';

const REGENERATE_OPTIONS = [
  { value: 'shorter', label: 'Shorter' },
  { value: 'detailed', label: 'More detailed' },
  { value: 'simpler', label: 'Simpler' },
  { value: 'professional', label: 'More professional' },
];

const ContentCardShell = ({
  type,
  label,
  videoId,
  item,
  DisplayComponent,
  isGenerating,
  onGenerate,
  onSaved,
  bare = false,
}) => {
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [copying, setCopying] = useState(false);

  const isTextType = typeof item?.content === 'string';

  const startEdit = () => {
    setEditValue(isTextType ? item.content : JSON.stringify(item.content, null, 2));
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditValue('');
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      let newContent = editValue;
      if (!isTextType) {
        try {
          newContent = JSON.parse(editValue);
        } catch {
          showToast('That JSON is not valid — fix the syntax and try again', 'error');
          setSaving(false);
          return;
        }
      }
      const { content } = await updateContentItem(item._id, newContent);
      onSaved?.(content);
      setEditing(false);
      showToast('Saved');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save changes', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = async () => {
    setCopying(true);
    try {
      await copyContentAsText(videoId, type);
      showToast('Copied to clipboard');
    } catch {
      showToast('Failed to copy', 'error');
    } finally {
      setCopying(false);
    }
  };

  const Wrapper = bare ? 'div' : Card;
  const Header = bare ? 'div' : CardHeader;
  const Title = bare ? 'h3' : CardTitle;
  const Content = bare ? 'div' : CardContent;
  const headerClass = bare
    ? 'flex flex-row items-center justify-between flex-wrap gap-2 pb-3'
    : 'flex flex-row items-center justify-between flex-wrap gap-2';
  const titleClass = bare ? 'text-base font-semibold' : 'text-base';

  return (
    <Wrapper>
      <Header className={headerClass}>
        <Title className={titleClass}>{label}</Title>

        <div className="flex items-center gap-2 flex-wrap">
          {item && !editing && (
            <>
              <Button size="sm" variant="outline" onClick={handleCopy} disabled={copying}>
                {copying ? <Loader2 className="w-3 h-3 animate-spin" /> : <Copy className="w-3 h-3" />}
                Copy
              </Button>
              <Button size="sm" variant="outline" onClick={startEdit}>
                <Pencil className="w-3 h-3" />
                Edit
              </Button>
              <ExportButtons videoId={videoId} type={type} />
            </>
          )}

          {editing ? (
            <>
              <Button size="sm" onClick={saveEdit} disabled={saving}>
                {saving ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Check className="w-3 h-3 mr-1" />}
                Save
              </Button>
              <Button size="sm" variant="ghost" onClick={cancelEdit} disabled={saving}>
                <X className="w-3 h-3 mr-1" />
                Cancel
              </Button>
            </>
          ) : (
            <div className="flex">
              <Button
                size="sm"
                onClick={() => onGenerate()}
                disabled={isGenerating}
                className={item ? 'rounded-r-none' : ''}
              >
                {isGenerating ? (
                  <><Loader2 className="w-3 h-3 mr-2 animate-spin" />Generating...</>
                ) : (
                  <><Sparkles className="w-3 h-3 mr-2" />{item ? 'Regenerate' : 'Generate'}</>
                )}
              </Button>

              {item && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" className="rounded-l-none border-l border-l-primary-foreground/20 px-1.5" disabled={isGenerating}>
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Regenerate as...</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {REGENERATE_OPTIONS.map((opt) => (
                      <DropdownMenuItem key={opt.value} onClick={() => onGenerate(opt.value)}>
                        {opt.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}
        </div>
      </Header>

      <Content>
        {editing ? (
          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            rows={isTextType ? 8 : 14}
            className="font-mono text-xs"
          />
        ) : item ? (
          <DisplayComponent content={item.content} />
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            Not generated yet. Click "Generate" above.
          </p>
        )}
      </Content>
    </Wrapper>
  );
};

export default ContentCardShell;
