import express from 'express';
import {
  getQuestionnaire,
  saveQuestionnaire,
} from '../controllers/profileController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/questionnaire', protect, getQuestionnaire);
router.post('/questionnaire', protect, saveQuestionnaire);

export default router;