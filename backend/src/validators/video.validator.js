import { body } from 'express-validator';
import { isValidYoutubeUrl } from '../utils/youtubeUrl.js';

export const processVideoValidator = [
  body('url')
    .trim()
    .notEmpty()
    .withMessage('YouTube URL is required')
    .custom((value) => {
      if (!isValidYoutubeUrl(value)) {
        throw new Error('Please provide a valid YouTube URL');
      }
      return true;
    }),
];
