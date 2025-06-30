import express from 'express';
import { AdminController } from '../controllers/admin.controller';
import { isAdmin,isAdminOrTeacher,isAuthenticated } from '../middleware/auth.middleware';
import { 
    getUserProfile, 
    updateUserProfile, 
    verifyUser, 
    deleteUser, 
    getAllUsers, 
    updateCredits 
} from '../controllers/user.controller';


const router = express.Router();
const adminController = new AdminController();

// Get all lesson reports
router.get('/reports',isAdmin as any, adminController.getAllLessonReports as any);

// Add a new member
router.post('/members', isAdmin as any, adminController.addMember as any);

// Update member
router.put('/members/:id', isAdmin as any, adminController.updateMember as any);

// Update contact information
router.put('/contact', isAdmin as any, adminController.updateContactInfo as any);

// Get user profile
router.get('/profile', isAdminOrTeacher as any, getUserProfile as any);

// Update user profile
router.put('/profile', isAdmin as any, updateUserProfile as any);

// Verify a user (admin only)
router.patch('/verify', isAdmin as any, verifyUser as any);

// Delete user account
router.delete('/profile', isAdmin as any, deleteUser as any);

// Get all users (admin only)
router.get('/all', isAdmin as any, getAllUsers as any);

// Update user credits (admin only)
router.patch('/credits', isAdmin as any, updateCredits as any);

export default router;