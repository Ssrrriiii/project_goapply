import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
} from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/logout', protect, logout);

export default router;