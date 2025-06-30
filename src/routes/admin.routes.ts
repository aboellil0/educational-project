import express from 'express';
import { AdminController } from '../controllers/admin.controller';
import { isAdmin } from '../middleware/auth.middleware';

const router = express.Router();
const adminController = new AdminController();

// Get all lesson reports
router.get('/reports', isAdmin, adminController.getAllLessonReports);

// Add a new member
router.post('/members', isAdmin, adminController.addMember);

// Update member
router.put('/members/:id', isAdmin, adminController.updateMember);

// Update contact information
router.put('/contact', isAdmin, adminController.updateContactInfo);

export default router;