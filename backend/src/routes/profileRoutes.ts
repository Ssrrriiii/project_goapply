import express from 'express';
import {
  getProfile,
  updateProfile,
  saveQuestionnaireStep,
  getQuestionnaireProgress,
  completeQuestionnaire,
} from '../controllers/profileController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Profile routes
router.get('/', protect, getProfile);
router.put('/', protect, updateProfile);

// Questionnaire routes
router.get('/questionnaire/progress', protect, getQuestionnaireProgress);
router.post('/questionnaire/step', protect, saveQuestionnaireStep);
router.post('/questionnaire/complete', protect, completeQuestionnaire);

export default router;