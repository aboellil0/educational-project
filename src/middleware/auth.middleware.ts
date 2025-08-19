import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/token.services';
import User, { IUser } from '../models/user.model';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const isAuthenticated = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Auth Header:', authHeader); // Debug
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access token is required' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    console.log('Decoded Token:', decoded); // Debug
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Error:', error); // Debug
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const isVerified = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.isVerified) {
    return res.status(403).json({ message: 'Email not verified' });
  }
  next();
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user?.role || !req.user.role.includes('admin')) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

export const isTeacher =  (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user?.role || !req.user.role.includes('teacher')) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

export const isAdminOrTeacher = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user?.role || (!req.user.role.includes('admin') && !req.user.role.includes('teacher'))) {
    return res.status(403).json({ message: 'Access denied. Admin or Teacher role required' });
  }
  next();
};


// middleware to check if a student has PrivateCredits and PublicCredits

export const hasPriviteCredits = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  if (req.user.PrivitelessonCredits <= 0) {
    return res.status(403).json({ message: 'Insufficient private credits' });
  }
  next();
};

export const hasPublicCredits = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  if (req.user.PubliclessonCredits <= 0) {
    return res.status(403).json({ message: 'Insufficient public credits' });
  }
  next();
};