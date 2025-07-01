import express, { RequestHandler } from 'express';
import { 
    getUserProfile, 
    updateUserProfile, 
    verifyUser, 
    deleteUser, 
    getAllUsers, 
    getMylessons, 
    updateCredits, 
    getMyReports
} from '../controllers/user.controller';
import { isAuthenticated, isAdmin } from '../middleware/auth.middleware';

const router = express.Router();

// Get current user profile
router.get('/profile', isAuthenticated as any, getUserProfile as any);

// Update current user profile
router.put('/profile', isAuthenticated as any, updateUserProfile as any);

// Verify a user (admin only)
router.patch('/verify', isAuthenticated as any,isAdmin as any, verifyUser as any);

// Delete current user account
router.delete('/profile', isAuthenticated as any, deleteUser as any);

// Get all users (admin only)
router.get('/all', isAdmin as any, getAllUsers as any);

// Get current user's lessons
router.get('/my-lessons', isAuthenticated  as any, getMylessons as any);

// Get my Reports
router.get('/my-lessons', isAuthenticated  as any, getMyReports as any);

// Update user credits (admin only)
router.patch('/credits', isAuthenticated as any,isAdmin as any, updateCredits as any);


export default router;