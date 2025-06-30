import express from 'express';
import { ReportController } from '../controllers/reportController';
import { auth } from '../middleware/auth.middleware';

const router = express.Router();
const reportController = new ReportController();

// Create a report for a lesson
router.post('/lesson/:lessonId', auth, reportController.createReport);

// Get all reports for a specific lesson
router.get('/lesson/:id', auth, reportController.getLessonReports);

// Get a specific report by ID
router.get('/:id', auth, reportController.getLessonReportById);

// Update a report
router.put('/:id', auth, reportController.updateReport);

// Mark homework as done
router.patch('/:reportId/homework/done', auth, reportController.doneHomework);

// Get all reports for a specific student
router.get('/student/:id', auth, reportController.getStudentReports);

export default router;