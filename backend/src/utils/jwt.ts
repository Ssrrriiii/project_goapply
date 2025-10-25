import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: string;
}

export const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  // Cast the entire call to string
  return jwt.sign(
    { id: userId },
    secret,
    { expiresIn: '7d' }
  ) as string;
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    return jwt.verify(token, secret) as TokenPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};