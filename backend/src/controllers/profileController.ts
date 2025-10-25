import { Response } from 'express';
import UserProfile from '../models/UserProfile';
import { AuthRequest } from '../middleware/auth';

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
export const getProfile = async (req: AuthRequest, res: Response) => {
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

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const profileData = req.body;

    const profile = await UserProfile.findOneAndUpdate(
      { userId: req.user._id },
      profileData,
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

// @desc    Save questionnaire step
// @route   POST /api/profile/questionnaire/step
// @access  Private
export const saveQuestionnaireStep = async (req: AuthRequest, res: Response) => {
  try {
    const { step, data } = req.body;

    if (!step || step < 1 || step > 8) {
      return res.status(400).json({
        success: false,
        error: 'Invalid step number. Must be between 1 and 8.',
      });
    }

    // Update profile with step data and progress
    const updateData = {
      ...data,
      currentStep: step,
      $addToSet: { completedSteps: step },
    };

    const profile = await UserProfile.findOneAndUpdate(
      { userId: req.user._id },
      updateData,
      { new: true, runValidators: true, upsert: true }
    );

    res.json({
      success: true,
      profile,
      currentStep: step,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

// @desc    Get questionnaire progress
// @route   GET /api/profile/questionnaire/progress
// @access  Private
export const getQuestionnaireProgress = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.user._id });

    res.json({
      success: true,
      currentStep: profile?.currentStep || 1,
      completedSteps: profile?.completedSteps || [],
      profile,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

// @desc    Complete questionnaire
// @route   POST /api/profile/questionnaire/complete
// @access  Private
export const completeQuestionnaire = async (req: AuthRequest, res: Response) => {
  try {
    const profileData = req.body;

    const profile = await UserProfile.findOneAndUpdate(
      { userId: req.user._id },
      {
        ...profileData,
        currentStep: 8,
        completedSteps: [1, 2, 3, 4, 5, 6, 7, 8],
      },
      { new: true, runValidators: true, upsert: true }
    );

    res.json({
      success: true,
      profile,
      message: 'Questionnaire completed successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};