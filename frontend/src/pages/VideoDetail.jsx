import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { getVideoById } from '../services/video.service';
import { useGenerateContent } from '../hooks/useGenerateContent';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '../context/ToastContext';

import SummaryCard from '../components/content/SummaryCard';
import BlogCard from '../components/content/BlogCard';
import LinkedInCard from '../components/content/LinkedInCard';
import TwitterCard from '../components/content/TwitterCard';
import NotesCard from '../components/content/NotesCard';
import McqCard from '../components/content/McqCard';
import ExportButtons from '../components/content/ExportButtons';

const CONTENT_TABS = [
  { type: 'summary', label: 'Summary', Component: SummaryCard },
  { type: 'blog', label: 'Blog', Component: BlogCard },
  { type: 'linkedin', label: 'LinkedIn', Component: LinkedInCard },
  { type: 'twitter', label: 'X Thread', Component: TwitterCard },
  { type: 'notes', label: 'Notes', Component: NotesCard },
  { type: 'mcq', label: 'MCQs', Component: McqCard },
];

const statusVariant = {
  completed: 'secondary',
  processing: 'outline',
  failed: 'destructive',
};

const VideoDetail = () => {
  const { id } = useParams();
  const { showToast } = useToast();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['video', id],
    queryFn: () => getVideoById(id),
  });

  const { mutate: generate, isPending, variables: pendingType } = useGenerateContent(id);

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
            <AlertCircle className="w-6 h-6 text-destructive" />
            <p className="text-sm text-muted-foreground">
              Couldn't load this video. It may not exist, or you may not have access to it.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const findContent = (type) => data.generatedContent?.find((c) => c.type === type)?.content;

  const handleGenerate = (type) => {
    generate(type, {
      onError: (err) => {
        showToast(err.response?.data?.message || `Failed to generate ${type}`, 'error');
      },
    });
  };

  const isFailedVideo = data.video.status === 'failed';
  const isProcessing = data.video.status === 'processing';

  return (
    <div className="p-8 space-y-4 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold truncate">{data.video.youtubeUrl}</h1>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant={statusVariant[data.video.status] || 'outline'}>{data.video.status}</Badge>
          <p className="text-sm text-muted-foreground">{data.video.wordCount} words in transcript</p>
        </div>
      </div>

      {isFailedVideo && (
        <Card>
          <CardContent className="py-4 text-sm text-destructive flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            This video's transcript could not be retrieved (captions may be disabled or unavailable).
            Content generation isn't possible for this video.
          </CardContent>
        </Card>
      )}

      {isProcessing && (
        <Card>
          <CardContent className="py-4 text-sm text-muted-foreground flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            This video is still processing. Refresh in a moment.
          </CardContent>
        </Card>
      )}

      {!isFailedVideo && !isProcessing && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Transcript</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap max-h-64 overflow-y-auto text-left text-muted-foreground">
              {data.transcript?.rawText}
            </p>
          </CardContent>
        </Card>
      )}

      {!isFailedVideo && !isProcessing && (
        <Tabs defaultValue="summary">
          <TabsList className="flex-wrap h-auto">
            {CONTENT_TABS.map(({ type, label }) => (
              <TabsTrigger key={type} value={type}>{label}</TabsTrigger>
            ))}
          </TabsList>

          {CONTENT_TABS.map(({ type, label, Component }) => {
            const content = findContent(type);
            const isGeneratingThis = isPending && pendingType === type;

            return (
              <TabsContent key={type} value={type}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
                    <CardTitle className="text-base">{label}</CardTitle>
                    <div className="flex items-center gap-2">
                      {content && <ExportButtons videoId={id} type={type} />}
                      <Button size="sm" onClick={() => handleGenerate(type)} disabled={isPending}>
                        {isGeneratingThis ? (
                          <><Loader2 className="w-3 h-3 mr-2 animate-spin" />Generating...</>
                        ) : (
                          <><Sparkles className="w-3 h-3 mr-2" />{content ? 'Regenerate' : 'Generate'}</>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {content ? (
                      <Component content={content} />
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        Not generated yet. Click "Generate" above.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </div>
  );
};

export default VideoDetail;
