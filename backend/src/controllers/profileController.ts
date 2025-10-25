import { Response } from 'express';
import UserProfile from '../models/UserProfile';
import { AuthRequest } from '../middleware/auth';

// @desc    Get questionnaire data
// @route   GET /api/profile/questionnaire
// @access  Private
export const getQuestionnaire = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.user._id });

    res.json({
      success: true,
      profile,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

// @desc    Save/update questionnaire
// @route   POST /api/profile/questionnaire
// @access  Private
export const saveQuestionnaire = async (req: AuthRequest, res: Response) => {
  try {
    const {
      fieldOfStudy,
      studyLevel,
      englishTest,
      englishScore,
      availableFunds,
      visaRefusal,
      studyStartDate,
      educationLevel,
    } = req.body;

    const profile = await UserProfile.findOneAndUpdate(
      { userId: req.user._id },
      {
        fieldOfStudy,
        studyLevel,
        englishTest,
        englishScore,
        availableFunds,
        visaRefusal,
        studyStartDate,
        educationLevel,
      },
      { new: true, runValidators: true, upsert: true }
    );

    res.json({
      success: true,
      profile,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};