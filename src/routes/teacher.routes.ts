import express from 'express';

import {TeacherController} from '../controllers/teacher.controller';
import { LessonController } from '../controllers/lesson.controller';
import { isAuthenticated, isAdmin, isAdminOrTeacher, isTeacher } from '../middleware/auth.middleware';

const teacherController = new TeacherController();
const lessonContoller = new LessonController();
const router = express.Router();



// Get current user's lessons
router.get('/my-lessons', isAuthenticated as any, teacherController.getMyLessons as any);


export default router;