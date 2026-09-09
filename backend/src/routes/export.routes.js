import express from 'express';
import { exportMarkdown, exportDocx } from '../controllers/export.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/:videoId/:type/markdown', exportMarkdown);
router.get('/:videoId/:type/docx', exportDocx);

export default router;
