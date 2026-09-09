import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, ExternalLink } from 'lucide-react';
import { getVideos, deleteVideo } from '../services/video.service';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '../context/ToastContext';

const statusVariant = {
  completed: 'secondary',
  processing: 'outline',
  failed: 'destructive',
};

const History = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['videos'],
    queryFn: getVideos,
  });

  const { mutate: removeVideo, isPending: isDeleting } = useMutation({
    mutationFn: deleteVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      showToast('Video deleted');
    },
    onError: (err) => {
      showToast(err.response?.data?.message || 'Failed to delete video', 'error');
    },
  });

  const handleDelete = (id) => {
    if (window.confirm('Delete this video and all its generated content? This cannot be undone.')) {
      removeVideo(id);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold">History</h1>
        <p className="text-muted-foreground">All the videos you've processed.</p>
      </div>

      {isLoading && (
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      )}

      {isError && (
        <p className="text-sm text-destructive">
          Couldn't load your history. Please try refreshing the page.
        </p>
      )}

      {!isLoading && !isError && data?.videos.length === 0 && (
        <Card>
          <CardContent className="text-center py-10 text-muted-foreground">
            No videos processed yet.
            <div className="mt-4">
              <Button asChild>
                <Link to="/process">Process your first video</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {data?.videos.map((video) => (
          <Card key={video._id}>
            <CardContent className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{video.youtubeUrl}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={statusVariant[video.status] || 'outline'}>{video.status}</Badge>
                  <span className="text-xs text-muted-foreground">{video.wordCount} words</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(video.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Button variant="ghost" size="icon-sm" asChild>
                  <Link to={`/videos/${video._id}`}>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleDelete(video._id)}
                  disabled={isDeleting}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default History;
