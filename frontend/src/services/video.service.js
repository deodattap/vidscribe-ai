import api from './api';

export const processVideo = async (url) => {
  const response = await api.post('/videos/process', { url });
  return response.data;
};

export const getVideos = async () => {
  const response = await api.get('/videos');
  return response.data;
};

export const getVideoById = async (id) => {
  const response = await api.get(`/videos/${id}`);
  return response.data;
};

export const deleteVideo = async (id) => {
  const response = await api.delete(`/videos/${id}`);
  return response.data;
};