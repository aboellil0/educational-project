import express from 'express';

import {TeacherController} from '../controllers/teacher.controller';
import { LessonController } from '../controllers/lesson.controller';
import { isAuthenticated, isAdmin, isAdminOrTeacher, isTeacher } from '../middleware/auth.middleware';

const teacherController = new TeacherController();
const lessonContoller = new LessonController();
const router = express.Router();



// Get current user's lessons
router.get('/my-lessons', isAuthenticated as any, teacherController.getMyLessons as any);


// Create Teacher (admin)
router.post('/', isAdmin as any, teacherController.createTeacher as any);

// Get all teachers
router.get('/', isAuthenticated as any, teacherController.getTeachers as any);

// Get teacher by ID
router.get('/:id', isAuthenticated as any, teacherController.getTeacherById as any);

// Update teacher (admin/teacher)
router.put('/:id', isAdminOrTeacher as any, teacherController.updateTeacher as any);

// Delete teacher (admin)
router.delete('/:id', isAdmin as any, teacherController.deleteTeacher as any);


export default router;