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
router.get('/reports',isAuthenticated as any,isAdmin as any, adminController.getAllLessonReports as any);

// Add a new member
router.post('/members', isAuthenticated as any,isAdmin as any, adminController.addMember as any);

// Update member
router.put('/members/:id', isAuthenticated as any,isAdmin as any, adminController.updateMember as any);

// Update contact information
router.put('/contact', isAuthenticated as any,isAdmin as any, adminController.updateContactInfo as any);

// Get user profile
router.get('/profile', isAuthenticated as any,isAdminOrTeacher as any, getUserProfile as any);

// Update user profile
router.put('/profile', isAuthenticated as any,isAdmin as any, updateUserProfile as any);

// Verify a user (admin only)
router.patch('/verify', isAuthenticated as any,isAdmin as any, verifyUser as any);

// Delete user account
router.delete('/profile', isAuthenticated as any,isAdmin as any, deleteUser as any);

// Get all users (admin only)
router.get('/all', isAuthenticated as any,isAdmin as any, getAllUsers as any);

// Update user credits (admin only)
router.patch('/credits', isAuthenticated as any,isAdmin as any, updateCredits as any);

// create admin
router.post('/',isAuthenticated as any,isAdmin as any,adminController.createAdmin as any)

export default router;