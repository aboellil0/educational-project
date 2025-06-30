import express from 'express';
import { ReportController } from '../controllers/report.controller';
import { isAdminOrTeacher, isAuthenticated, isTeacher } from '../middleware/auth.middleware';

const router = express.Router();
const reportController = new ReportController();

// Create a report for a lesson
router.post('/lesson/:lessonId', isTeacher as any, reportController.createReport  as any);

// Get all reports for a specific lesson (admin/teacher)
router.get('/lesson/:id', isAdminOrTeacher as any, reportController.getLessonReports as any);

// Get a specific report by ID (admin/teacher)
router.get('/:id', isAdminOrTeacher as any, reportController.getLessonReportById as any);

// Update a report
router.put('/:id', isAdminOrTeacher as any, reportController.updateReport as any);

// Mark homework as done
router.patch('/:reportId/homework/done', isTeacher as any, reportController.doneHomework as any);

// Get all reports for a specific student
router.get('/student/:id', isAdminOrTeacher as any, reportController.getStudentReports as any);

export default router;