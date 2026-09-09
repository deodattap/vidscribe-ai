import api from './api';

/**
 * Downloads generated content as a file (markdown or docx) by streaming the
 * backend's response as a blob and triggering a browser save-as, rather than
 * navigating directly (navigating would drop the Authorization header,
 * since these routes are protected).
 */
export const exportContent = async (videoId, type, format) => {
  const response = await api.get(`/export/${videoId}/${type}/${format}`, {
    responseType: 'blob',
  });

  const disposition = response.headers['content-disposition'] || '';
  const match = disposition.match(/filename="(.+)"/);
  const filename = match ? match[1] : `vidscribe-${type}.${format === 'docx' ? 'docx' : 'md'}`;

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
