import express from 'express';
import { LessonController } from '../controllers/lesson.controller';
import { isAdminOrTeacher, isAuthenticated, isTeacher } from '../middleware/auth.middleware';

const router = express.Router();
const lessonController = new LessonController();

// Get lesson by ID
router.get('/:id', isAuthenticated as any, lessonController.getLessonById as any);

// Get lessons by group ID
router.get('/group/:id', isAuthenticated as any, lessonController.getLessonsByGroup as any);

// Add lesson to group (teacher/admin only)
router.post('/group/:id', isAuthenticated as any,isAdminOrTeacher as any, lessonController.addlessonToGroup as any);

// Add homework to lesson (teacher only)
router.patch('/:id/homework', isAuthenticated as any,isTeacher as any, lessonController.addHomewrok as any);

// Get lesson homework
router.get('/:id/homework', isAuthenticated as any, lessonController.getLessonHomework as any);

// Update lesson (teacher/admin only)
router.put('/:id', isAuthenticated as any,isAdminOrTeacher as any, lessonController.updateLesson as any);

// Delete lesson (teacher/admin only)
router.delete('/:id', isAuthenticated as any,isAdminOrTeacher as any, lessonController.deleteLesson as any);

export default router;