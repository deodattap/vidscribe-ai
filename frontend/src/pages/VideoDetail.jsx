import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getVideoById } from '../services/video.service';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const VideoDetail = () => {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ['video', id],
    queryFn: () => getVideoById(id),
  });

  if (isLoading) {
    return <div className="p-8"><Skeleton className="h-40 w-full" /></div>;
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">{data?.video.youtubeUrl}</h1>
      <p className="text-sm text-muted-foreground">
        Status: {data?.video.status} · {data?.video.wordCount} words
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Transcript</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
            {data?.transcript?.rawText}
          </p>
        </CardContent>
      </Card>

      {/* AI content generation cards go here — Phase 5 */}
    </div>
  );
};

export default VideoDetail;