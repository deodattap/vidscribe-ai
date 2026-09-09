import { useState } from 'react';
import { FileText, FileDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportContent } from '../../services/export.service';
import { useToast } from '../../context/ToastContext';

const ExportButtons = ({ videoId, type }) => {
  const [downloading, setDownloading] = useState(null); // 'markdown' | 'docx' | null
  const { showToast } = useToast();

  const handleExport = async (format) => {
    setDownloading(format);
    try {
      await exportContent(videoId, type, format);
    } catch (err) {
      showToast(
        err.response?.data?.message || `Failed to export as ${format}`,
        'error'
      );
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleExport('markdown')}
        disabled={downloading !== null}
      >
        {downloading === 'markdown' ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <FileText className="w-3 h-3" />
        )}
        .md
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleExport('docx')}
        disabled={downloading !== null}
      >
        {downloading === 'docx' ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <FileDown className="w-3 h-3" />
        )}
        .docx
      </Button>
    </div>
  );
};

export default ExportButtons;
