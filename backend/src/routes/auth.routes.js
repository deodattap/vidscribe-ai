import express from 'express';
import { register, login, getProfile, updateProfile, changePassword } from '../controllers/auth.controller.js';
import { registerValidator, loginValidator, changePasswordValidator } from '../validators/auth.validator.js';
import validateRequest from '../middleware/validateRequest.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', registerValidator, validateRequest, register);
router.post('/login', loginValidator, validateRequest, login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePasswordValidator, validateRequest, changePassword);

export default router;