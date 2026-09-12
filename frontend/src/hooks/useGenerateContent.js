import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateContent, generateBatchContent } from '../services/content.service';

export const useGenerateContent = (videoId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ type, params }) => generateContent(type, videoId, params),
    onSuccess: () => {
      // Invalidate cached video detail/stats so they refetch with the new content
      queryClient.invalidateQueries({ queryKey: ['video', videoId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
};

export const useGenerateBatchContent = (videoId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ types, params }) => generateBatchContent(videoId, types, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['video', videoId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
};
