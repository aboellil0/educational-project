import express from 'express';
import { LessonController } from '../controllers/lesson.controller';
import { isAdminOrTeacher, isAuthenticated, isTeacher } from '../middleware/auth.middleware';

const router = express.Router();
const lessonController = new LessonController();

/**
 * @swagger
 * tags:
 *   name: Lessons
 *   description: Lesson management endpoints
 */

/**
 * @swagger
 * /lesson/{id}:
 *   get:
 *     summary: Get lesson by ID
 *     tags: [Lessons]
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
 *         description: Lesson retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *       404:
 *         description: Lesson not found
 *       401:
 *         description: Unauthorized
 *   put:
 *     summary: Update lesson (admin/teacher only)
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Tajweed Rules - Part 1"
 *               description:
 *                 type: string
 *                 example: "Introduction to basic Tajweed rules"
 *               scheduledAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-01-15T10:00:00Z"
 *               duration:
 *                 type: number
 *                 example: 60
 *               status:
 *                 type: string
 *                 enum: [scheduled, ongoing, completed, cancelled]
 *                 example: "scheduled"
 *     responses:
 *       200:
 *         description: Lesson updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *       404:
 *         description: Lesson not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or Teacher access required
 *   delete:
 *     summary: Delete lesson (admin/teacher only)
 *     tags: [Lessons]
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
 *         description: Lesson deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Lesson not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or Teacher access required
 */
router.get('/:id', isAuthenticated as any, lessonController.getLessonById as any);
router.put('/:id', isAuthenticated as any,isAdminOrTeacher as any, lessonController.updateLesson as any);
router.delete('/:id', isAuthenticated as any,isAdminOrTeacher as any, lessonController.deleteLesson as any);

/**
 * @swagger
 * /lesson/group/{id}:
 *   get:
 *     summary: Get lessons by group ID
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Group ID
 *     responses:
 *       200:
 *         description: Group lessons retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lesson'
 *       404:
 *         description: Group not found
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Add lesson to group (admin/teacher only)
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Group ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - scheduledAt
 *               - duration
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Surah Al-Fatiha Memorization"
 *               description:
 *                 type: string
 *                 example: "Learn and memorize Surah Al-Fatiha with proper pronunciation"
 *               scheduledAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-01-15T10:00:00Z"
 *               duration:
 *                 type: number
 *                 example: 90
 *               students:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of student IDs
 *     responses:
 *       201:
 *         description: Lesson added to group successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Group not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or Teacher access required
 */
router.get('/group/:id', isAuthenticated as any, lessonController.getLessonsByGroup as any);
router.post('/group/:id', isAuthenticated as any,isAdminOrTeacher as any, lessonController.addlessonToGroup as any);

/**
 * @swagger
 * /lesson/{id}/homework:
 *   patch:
 *     summary: Add homework to lesson (teacher only)
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               - homework
 *             properties:
 *               homework:
 *                 type: string
 *                 example: "Memorize verses 1-10 of Surah Al-Baqarah and practice recitation"
 *     responses:
 *       200:
 *         description: Homework added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *       404:
 *         description: Lesson not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Teacher access required
 *   get:
 *     summary: Get lesson homework
 *     tags: [Lessons]
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
 *         description: Homework retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 homework:
 *                   type: string
 *                 lessonId:
 *                   type: string
 *                 title:
 *                   type: string
 *       404:
 *         description: Lesson not found
 *       401:
 *         description: Unauthorized
 */
router.patch('/:id/homework', isAuthenticated as any,isTeacher as any, lessonController.addHomewrok as any);
router.get('/:id/homework', isAuthenticated as any, lessonController.getLessonHomework as any);

/**
 * @swagger
 * /lesson/{id}/complete:
 *   post:
 *     summary: Complete lesson for all students in the group who have credits
 *     tags: [Lessons]
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
 *         description: Lesson completed successfully for all eligible students
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lesson completion processed for all eligible students"
 *                 lessonId:
 *                   type: string
 *                   example: "507f1f77bcf86cd799439012"
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalEligibleStudents:
 *                       type: number
 *                       example: 5
 *                     completedSuccessfully:
 *                       type: number
 *                       example: 4
 *                     failed:
 *                       type: number
 *                       example: 1
 *                     teacherCreditsAdded:
 *                       type: number
 *                       example: 4
 *                 completedStudents:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       studentId:
 *                         type: string
 *                         example: "507f1f77bcf86cd799439011"
 *                       name:
 *                         type: string
 *                         example: "John Doe"
 *                       remainingCredits:
 *                         type: object
 *                         properties:
 *                           private:
 *                             type: number
 *                             example: 4
 *                           public:
 *                             type: number
 *                             example: 2
 *                 failedStudents:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       studentId:
 *                         type: string
 *                         example: "507f1f77bcf86cd799439013"
 *                       name:
 *                         type: string
 *                         example: "Jane Smith"
 *                       reason:
 *                         type: string
 *                         example: "Lesson already completed for this student"
 *       400:
 *         description: Bad request - Invalid lesson ID or no students with credits
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     invalidLessonId:
 *                       value: "Invalid lesson ID"
 *                     noStudentsWithCredits:
 *                       value: "No students with sufficient credits found in this group"
 *       404:
 *         description: Lesson or group not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     lessonNotFound:
 *                       value: "Lesson not found"
 *                     groupNotFound:
 *                       value: "Group not found"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /lesson/{id}/status:
 *   patch:
 *     summary: Update lesson status
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [scheduled, ongoing, completed, cancelled]
 *                 example: "ongoing"
 *     responses:
 *       200:
 *         description: Lesson status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 lesson:
 *                   $ref: '#/components/schemas/Lesson'
 *       404:
 *         description: Lesson not found
 *       401:
 *         description: Unauthorized
 */
router.patch('/:id/status', isAuthenticated as any, lessonController.updateLessonStatus as any);

export default router;