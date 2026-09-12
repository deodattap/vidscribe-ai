import express from 'express';

import {
  listContentTypes,
  generateVideoContent,
  generateBatchContent,
  updateGeneratedContentItem,
} from '../controllers/content.controller.js';

import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public — the landing page lists available formats without requiring login
router.get('/types', listContentTypes);

router.use(protect);

router.post('/batch', generateBatchContent);
router.put('/item/:id', updateGeneratedContentItem);

// Generic route for every registered content type (summary, blog, linkedin, ...)
router.post('/:type', generateVideoContent);

export default router;
