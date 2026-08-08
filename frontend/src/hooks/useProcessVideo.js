import { useMutation, useQueryClient } from '@tanstack/react-query';
import { processVideo } from '../services/video.service';

export const useProcessVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: processVideo,
    onSuccess: () => {
      // Invalidate cached video lists/stats so they refetch with the new video
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
};