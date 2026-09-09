import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateContent } from '../services/content.service';

export const useGenerateContent = (videoId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (type) => generateContent(type, videoId),
    onSuccess: () => {
      // Invalidate cached video detail/stats so they refetch with the new content
      queryClient.invalidateQueries({ queryKey: ['video', videoId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
};
