import express from 'express';
import { AdminController } from '../controllers/admin.controller';
import { isAdmin,isAdminOrTeacher,isAuthenticated } from '../middleware/auth.middleware';
import { 
    getUserProfile, 
    updateUserProfile, 
    verifyUser, 
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

// Get contact information
router.get('/contact', adminController.getContactInfo as any);

// create contact information
router.post('/contact', isAuthenticated as any,isAdmin as any, adminController.createContactInfo as any);

// Get user profile
router.get('/profile', isAuthenticated as any,isAdminOrTeacher as any, getUserProfile as any);

// Update user profile
router.put('/profile', isAuthenticated as any,isAdmin as any, updateUserProfile as any);

// Verify a user (admin only)
router.patch('/verify', isAuthenticated as any,isAdmin as any, verifyUser as any);

// Delete user account
router.delete('/member/:id', isAuthenticated as any,isAdmin as any, adminController.deleteMember as any);

// Get all users (admin only)
router.get('/all', isAuthenticated as any,isAdmin as any, getAllUsers as any);

// Update user credits (admin only)
router.patch('/credits', isAuthenticated as any,isAdmin as any, updateCredits as any);

// create admin
router.post('/',isAuthenticated as any,isAdmin as any,adminController.createAdmin as any)

// add numberOflessonsCridets for teacher
router.post('/addNumberOfLessonsCredits', isAuthenticated as any,isAdmin as any, adminController.addNumberOfLessonsCredits as any);

// get all students
router.get('/students', isAuthenticated as any,isAdmin as any, adminController.getAllStudents as any);

// get all admins
router.get('/admins', isAuthenticated as any,isAdmin as any, adminController.getAllAdmins as any);

// get admin by id
router.get('/admins/:id', isAuthenticated as any,isAdmin as any, adminController.getAdminById as any);

export default router;