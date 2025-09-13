import express from 'express';
import { ReportController } from '../controllers/report.controller';
import { isAdminOrTeacher, isAuthenticated, isTeacher } from '../middleware/auth.middleware';

const router = express.Router();
const reportController = new ReportController();

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Lesson report management endpoints
 */

/**
 * @swagger
 * /report/lesson/{lessonId}:
 *   post:
 *     summary: Create a report for a lesson (teacher only)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *         description: Lesson ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - student
 *               - attendance
 *               - performance
 *             properties:
 *               student:
 *                 type: string
 *                 description: Student ID
 *                 example: "60f7c1b9e1d4b2a3c4e5f6a9"
 *               attendance:
 *                 type: boolean
 *                 example: true
 *               performance:
 *                 type: string
 *                 example: "Excellent memorization progress, good pronunciation"
 *               notes:
 *                 type: string
 *                 example: "Student showed great improvement in Tajweed rules"
 *               homeworkStatus:
 *                 type: string
 *                 enum: [not_assigned, assigned, completed]
 *                 example: "assigned"
 *     responses:
 *       201:
 *         description: Report created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LessonReport'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Teacher access required
 *       404:
 *         description: Lesson not found
 */
router.post('/lesson/:lessonId', isAuthenticated as any,isTeacher as any, reportController.createReport  as any);

/**
 * @swagger
 * /report/lesson/{id}:
 *   get:
 *     summary: Get all reports for a specific lesson (admin/teacher only)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lesson ID
 *     responses:
 *       200:
 *         description: Lesson reports retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LessonReport'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or Teacher access required
 *       404:
 *         description: Lesson not found
 */
router.get('/lesson/:id', isAuthenticated as any,isAdminOrTeacher as any, reportController.getLessonReports as any);

/**
 * @swagger
 * /report/{id}:
 *   get:
 *     summary: Get a specific report by ID (admin/teacher only)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Report ID
 *     responses:
 *       200:
 *         description: Report retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LessonReport'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or Teacher access required
 *       404:
 *         description: Report not found
 *   put:
 *     summary: Update a report (admin/teacher only)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Report ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               attendance:
 *                 type: boolean
 *               performance:
 *                 type: string
 *               notes:
 *                 type: string
 *               homeworkStatus:
 *                 type: string
 *                 enum: [not_assigned, assigned, completed]
 *     responses:
 *       200:
 *         description: Report updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LessonReport'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or Teacher access required
 *       404:
 *         description: Report not found
 */
router.get('/:id', isAuthenticated as any,isAdminOrTeacher as any, reportController.getLessonReportById as any);
router.put('/:id', isAuthenticated as any,isAdminOrTeacher as any, reportController.updateReport as any);

/**
 * @swagger
 * /report/{reportId}/homework/done:
 *   patch:
 *     summary: Mark homework as done (teacher only)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: string
 *         description: Report ID
 *     responses:
 *       200:
 *         description: Homework marked as done successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 report:
 *                   $ref: '#/components/schemas/LessonReport'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Teacher access required
 *       404:
 *         description: Report not found
 */
router.patch('/:reportId/homework/done', isAuthenticated as any,isTeacher as any, reportController.doneHomework as any);

/**
 * @swagger
 * /report/student/{id}:
 *   get:
 *     summary: Get all reports for a specific student (admin/teacher only)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of reports to return
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: Student reports retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reports:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/LessonReport'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     page:
 *                       type: number
 *                     limit:
 *                       type: number
 *                     totalPages:
 *                       type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or Teacher access required
 *       404:
 *         description: Student not found
 */
router.get('/student/:id', isAuthenticated as any,isAdminOrTeacher as any, reportController.getStudentReports as any);

export default router;