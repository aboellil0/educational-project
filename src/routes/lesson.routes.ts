import express from 'express';
import { LessonController } from '../controllers/lessonController';
import { auth, teacherAuth } from '../middleware/auth.middleware';

const router = express.Router();
const lessonController = new LessonController();

// Get lesson by ID
router.get('/:id', auth, lessonController.getLessonById);

// Get lessons by group ID
router.get('/group/:id', auth, lessonController.getLessonsByGroup);

// Add lesson to group (teacher only)
router.post('/group/:id', teacherAuth, lessonController.addlessonToGroup);

// Add homework to lesson (teacher only)
router.patch('/:id/homework', teacherAuth, lessonController.addHomewrok);

// Get lesson homework
router.get('/:id/homework', auth, lessonController.getLessonHomework);

// Update lesson (teacher only)
router.put('/:id', teacherAuth, lessonController.updateLesson);

// Delete lesson (teacher only)
router.delete('/:id', teacherAuth, lessonController.deleteLesson);

export default router;