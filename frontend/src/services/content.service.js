import api from './api';

export const generateContent = async (type, videoId) => {
  const response = await api.post(`/content/${type}`, { videoId });
  return response.data;
};
