import { Request, Response } from 'express';
import User from '../models/User';
import UserProfile from '../models/UserProfile';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields',
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists',
      });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
    });

    // Create empty profile
    await UserProfile.create({
      userId: user._id,
    });

    // Generate token
    const token = generateToken((user._id as any).toString());

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password',
      });
    }

    // Find user (include password)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Get profile
    const profile = await UserProfile.findOne({ userId: user._id });

    // Generate token
    const token = generateToken((user._id as any).toString());

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profile,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id);
    const profile = await UserProfile.findOne({ userId: req.user._id });

    res.json({
      success: true,
      user: {
        id: user?._id,
        email: user?.email,
        firstName: user?.firstName,
        lastName: user?.lastName,
        createdAt: user?.createdAt,
        profile,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { firstName, lastName, phone, dateOfBirth, nationality, address, bio } = req.body;

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName },
      { new: true, runValidators: true }
    );

    // Update profile
    const profile = await UserProfile.findOneAndUpdate(
      { userId: req.user._id },
      {
        phone,
        dateOfBirth,
        nationality,
        address,
        bio,
      },
      { new: true, runValidators: true, upsert: true }
    );

    res.json({
      success: true,
      user: {
        ...user?.toObject(),
        profile,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req: AuthRequest, res: Response) => {
  // With JWT, logout is handled on client side by removing token
  // But you can implement token blacklisting if needed
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
};