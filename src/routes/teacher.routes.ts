import express from 'express';

import {TeacherController} from '../controllers/teacher.controller';
import { LessonController } from '../controllers/lesson.controller';
import { isAuthenticated, isAdmin, isAdminOrTeacher, isTeacher } from '../middleware/auth.middleware';

const teacherController = new TeacherController();
const lessonContoller = new LessonController();
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Teachers
 *   description: Teacher management endpoints
 */

/**
 * @swagger
 * /teacher/my-lessons:
 *   get:
 *     summary: Get current teacher's lessons
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Teacher's lessons retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lesson'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Teacher access required
 */
router.get('/my-lessons', isAuthenticated as any, teacherController.getMyLessons as any);

/**
 * @swagger
 * /teacher:
 *   post:
 *     summary: Create a new teacher (admin only)
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Ahmed Mohamed"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "ahmed@example.com"
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               specialization:
 *                 type: string
 *                 example: "Quran Memorization"
 *               experience:
 *                 type: number
 *                 example: 5
 *     responses:
 *       201:
 *         description: Teacher created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *   get:
 *     summary: Get all teachers
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all teachers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Teacher'
 *       401:
 *         description: Unauthorized
 */
router.post('/', isAuthenticated as any,isAdmin as any, teacherController.createTeacher as any);
router.get('/', isAuthenticated as any, teacherController.getTeachers as any);

/**
 * @swagger
 * /teacher/{id}:
 *   get:
 *     summary: Get teacher by ID
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Teacher ID
 *     responses:
 *       200:
 *         description: Teacher retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       404:
 *         description: Teacher not found
 *       401:
 *         description: Unauthorized
 *   put:
 *     summary: Update teacher information (admin or teacher)
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Teacher ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               specialization:
 *                 type: string
 *               experience:
 *                 type: number
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Teacher updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       404:
 *         description: Teacher not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or Teacher access required
 *   delete:
 *     summary: Delete teacher (admin only)
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Teacher ID
 *     responses:
 *       200:
 *         description: Teacher deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Teacher not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/:id', isAuthenticated as any, teacherController.getTeacherById as any);
router.put('/:id', isAuthenticated as any,isAdminOrTeacher as any, teacherController.updateTeacher as any);
router.delete('/:id', isAuthenticated as any,isAdmin as any, teacherController.deleteTeacher as any);

export default router;