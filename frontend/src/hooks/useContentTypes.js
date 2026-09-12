import { useQuery } from '@tanstack/react-query';
import { getContentTypes } from '../services/content.service';

export const useContentTypes = () => {
  return useQuery({
    queryKey: ['content-types'],
    queryFn: getContentTypes,
    staleTime: Infinity, // this list only changes with a code deploy, not per-session
  });
};
