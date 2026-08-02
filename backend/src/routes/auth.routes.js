import express from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/auth.controller.js';
import { registerValidator, loginValidator } from '../validators/auth.validator.js';
import validateRequest from '../middleware/validateRequest.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', registerValidator, validateRequest, register);
router.post('/login', loginValidator, validateRequest, login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

export default router;