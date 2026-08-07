import express from 'express';
import { processVideo, getVideos, getVideoById, deleteVideo } from '../controllers/video.controller.js';
import { processVideoValidator } from '../validators/video.validator.js';
import validateRequest from '../middleware/validateRequest.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect); // every route below requires auth

router.post('/process', processVideoValidator, validateRequest, processVideo);
router.get('/', getVideos);
router.get('/:id', getVideoById);
router.delete('/:id', deleteVideo);

export default router;