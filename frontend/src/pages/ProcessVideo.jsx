import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Link as LinkIcon } from 'lucide-react';
import { useProcessVideo } from '../hooks/useProcessVideo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ProcessVideo = () => {
  const [url, setUrl] = useState('');
  const navigate = useNavigate();
  const { mutate, isPending, error } = useProcessVideo();

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(url, {
      onSuccess: (data) => {
        navigate(`/videos/${data.video._id}`);
      },
    });
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Process a video</h1>
        <p className="text-muted-foreground">
          Paste a YouTube URL to generate blogs, summaries, and more.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <LinkIcon className="w-5 h-5" />
            YouTube URL
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              disabled={isPending}
            />

            {error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {error.response?.data?.message || 'Something went wrong. Please try again.'}
                </AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={isPending || !url} className="w-full">
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing transcript...
                </>
              ) : (
                'Process Video'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessVideo;