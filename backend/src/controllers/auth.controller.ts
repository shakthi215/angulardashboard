import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth.middleware';

const generateToken = (id: string, userId: string, role: string): string => {
  const secret = process.env.JWT_SECRET as string;
  const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
  return jwt.sign({ id, userId, role }, secret, { expiresIn } as jwt.SignOptions);
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, password, role } = req.body;

    if (!userId || !password || !role) {
      res.status(400).json({
        success: false,
        message: 'User ID, password, and role are required.',
      });
      return;
    }

    // Find user by userId and include password for comparison
    const user = await User.findOne({ userId, role }).select('+password');

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials or role mismatch.',
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Contact admin.',
      });
      return;
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
      return;
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id.toString(), user.userId, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          userId: user.userId,
          username: user.username,
          email: user.email,
          role: user.role,
          department: user.department,
          avatar: user.avatar,
          lastLogin: user.lastLogin,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login.',
    });
  }
};

export const getProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const logout = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  // JWT is stateless; logout is handled on client side
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};
