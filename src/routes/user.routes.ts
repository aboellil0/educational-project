import express, { RequestHandler } from 'express';
import { 
    getUserProfile, 
    updateUserProfile, 
    verifyUser, 
    deleteUser, 
    getAllUsers, 
    getMylessons, 
    updateCredits, 
    getMyReports,
    getMyGroup,
    getUserStats,
    wantedForNextLesson
} from '../controllers/user.controller';
import { isAuthenticated, isAdmin } from '../middleware/auth.middleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *   put:
 *     summary: Update current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
 *               age:
 *                 type: number
 *               country:
 *                 type: string
 *               city:
 *                 type: string
 *               quranMemorized:
 *                 type: string
 *               numOfPartsofQuran:
 *                 type: number
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Delete current user account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', isAuthenticated as any, getUserProfile as any);
router.put('/profile', isAuthenticated as any, updateUserProfile as any);
router.delete('/profile', isAuthenticated as any, deleteUser as any);

/**
 * @swagger
 * /user/verify:
 *   patch:
 *     summary: Verify a user (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user to verify
 *     responses:
 *       200:
 *         description: User verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.patch('/verify', isAuthenticated as any,isAdmin as any, verifyUser as any);

/**
 * @swagger
 * /user/all:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/all',  isAuthenticated  as any,isAdmin as any, getAllUsers as any);

/**
 * @swagger
 * /user/my-lessons:
 *   get:
 *     summary: Get current user's lessons
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User lessons retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lesson'
 *       401:
 *         description: Unauthorized
 */
router.get('/my-lessons', isAuthenticated  as any, getMylessons as any);

/**
 * @swagger
 * /user/my-reports:
 *   get:
 *     summary: Get current user's lesson reports
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User reports retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LessonReport'
 *       401:
 *         description: Unauthorized
 */
router.get('/my-reports', isAuthenticated  as any, getMyReports as any);

/**
 * @swagger
 * /user/credits:
 *   patch:
 *     summary: Update user credits (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - credits
 *             properties:
 *               userId:
 *                 type: string
 *               credits:
 *                 type: number
 *     responses:
 *       200:
 *         description: Credits updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.patch('/credits', isAuthenticated as any,isAdmin as any, updateCredits as any);

/**
 * @swagger
 * /user/my-group:
 *   get:
 *     summary: Get current user's group
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User group retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Group'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not assigned to any group
 */
router.get('/my-group', isAuthenticated as any, getMyGroup as any);

/**
 * @swagger
 * /user/user-stats:
 *   get:
 *     summary: Get user statistics
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalLessons:
 *                   type: number
 *                 completedLessons:
 *                   type: number
 *                 pendingLessons:
 *                   type: number
 *                 totalCredits:
 *                   type: number
 *                 usedCredits:
 *                   type: number
 *       401:
 *         description: Unauthorized
 */
router.get('/user-stats', isAuthenticated as any, getUserStats as any);

/**
 * @swagger
 * /user/next-lesson:
 *   get:
 *     summary: Get next lesson information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Next lesson information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nextLesson:
 *                   $ref: '#/components/schemas/Lesson'
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No upcoming lessons found
 */
router.get('/next-lesson', isAuthenticated as any, wantedForNextLesson as any);

export default router;