import api from './api';

export const getContentTypes = async () => {
  const response = await api.get('/content/types');
  return response.data;
};

export const generateContent = async (type, videoId, params = {}) => {
  const response = await api.post(`/content/${type}`, { videoId, params });
  return response.data;
};

export const generateBatchContent = async (videoId, types, params = {}) => {
  const response = await api.post('/content/batch', { videoId, types, params });
  return response.data;
};

export const updateContentItem = async (id, content) => {
  const response = await api.put(`/content/item/${id}`, { content });
  return response.data;
};
