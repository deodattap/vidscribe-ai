import express from 'express';

import {
  generateVideoSummary,
  generateVideoBlog,
  generateSimpleContent,
} from '../controllers/content.controller.js';

import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/summary', generateVideoSummary);
router.post('/blog', generateVideoBlog);

// Generic route for LinkedIn, Twitter, Notes, and MCQ
router.post('/:type', generateSimpleContent);

export default router;