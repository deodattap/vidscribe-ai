import express from 'express';

import {
  generateVideoSummary,
  generateVideoBlog,
} from '../controllers/content.controller.js';

import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/summary', generateVideoSummary);
router.post('/blog', generateVideoBlog);

export default router;