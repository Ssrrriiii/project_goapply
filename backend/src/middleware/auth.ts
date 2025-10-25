import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;

    // Get token from header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route',
      });
    }

    // Verify token
    const decoded = verifyToken(token) as any;

    if (!decoded) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    }

    // Get user from token
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route',
    });
  }
};