import express from 'express';
import { 
    getUserProfile, 
    updateUserProfile, 
    verifyUser, 
    deleteUser, 
    getAllUsers, 
    getMylessons, 
    updateCredits 
} from '../controllers/userController';
import { auth, adminAuth } from '../middleware/auth.middleware';

const router = express.Router();

// Get current user profile
router.get('/profile', auth, getUserProfile);

// Update current user profile
router.put('/profile', auth, updateUserProfile);

// Verify a user (admin only)
router.patch('/verify', adminAuth, verifyUser);

// Delete current user account
router.delete('/profile', auth, deleteUser);

// Get all users (admin only)
router.get('/all', adminAuth, getAllUsers);

// Get current user's lessons
router.get('/my-lessons', auth, getMylessons);

// Update user credits (admin only)
router.patch('/credits', adminAuth, updateCredits);

export default router;