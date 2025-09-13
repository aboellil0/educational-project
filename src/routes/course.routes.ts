import { Router, Request, Response, NextFunction } from "express";
import { AdminController } from "../controllers/admin.controller";
import {
  isAdmin,
  isAdminOrTeacher,
  isAuthenticated,
} from "../middleware/auth.middleware";
import { CourseController } from "../controllers/course.controller";

// Add AuthRequest type import
interface AuthRequest extends Request {
  user?: any;
}

const router = Router();
const adminController = new AdminController();
const courseController = new CourseController();

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management endpoints
 */

// Helper function to wrap async route handlers
const asyncHandler =
  (fn: Function) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

/**
 * @swagger
 * /course/active:
 *   get:
 *     summary: Get all active courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of active courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 *       500:
 *         description: Server error
 */
router.get(
  "/active",
  asyncHandler((req: Request, res: Response) =>
    courseController.getActiveCourses(req, res)
  )
);

/**
 * @swagger
 * /course:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of all courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 *       500:
 *         description: Server error
 *   post:
 *     summary: Create a new course (admin only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - price
 *               - duration
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Quran Memorization Basics"
 *               description:
 *                 type: string
 *                 example: "Learn the fundamentals of Quran memorization"
 *               price:
 *                 type: number
 *                 example: 199.99
 *               duration:
 *                 type: number
 *                 example: 30
 *               level:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *                 example: "beginner"
 *               maxStudents:
 *                 type: number
 *                 example: 20
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get(
  "/",
  asyncHandler((req: Request, res: Response) =>
    courseController.getAllCourses(req, res)
  )
);

router.post(
  "/",
  isAuthenticated as any,
  isAdmin as any,
  asyncHandler((req: AuthRequest, res: Response) =>
    courseController.createCourse(req, res)
  )
);

/**
 * @swagger
 * /course/{id}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update course (admin only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               duration:
 *                 type: number
 *               level:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *               maxStudents:
 *                 type: number
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Course updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *   delete:
 *     summary: Delete course (admin only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Course not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get(
  "/:id",
  asyncHandler((req: Request, res: Response) =>
    courseController.getCourseById(req, res)
  )
);

router.put(
  "/:id",
  isAuthenticated as any,
  isAdmin as any,
  asyncHandler((req: AuthRequest, res: Response) =>
    courseController.updateCourse(req, res)
  )
);

router.delete(
  "/:id",
  isAuthenticated as any,
  isAdmin as any,
  asyncHandler((req: AuthRequest, res: Response) =>
    courseController.deleteCourse(req, res)
  )
);

/**
 * @swagger
 * /course/{courseId}/register:
 *   post:
 *     summary: Register for a course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
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
 *                 description: User ID who wants to register
 *     responses:
 *       200:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 registration:
 *                   type: object
 *       400:
 *         description: Registration failed
 *       404:
 *         description: Course not found
 */
router.post(
  "/:courseId/register",
  asyncHandler((req: Request, res: Response) =>
    courseController.registerForCourse(req, res)
  )
);

/**
 * @swagger
 * /course/{courseId}/registrations:
 *   get:
 *     summary: Get course registrations (admin only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course registrations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user:
 *                     $ref: '#/components/schemas/User'
 *                   registrationDate:
 *                     type: string
 *                     format: date-time
 *                   status:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Course not found
 */
router.get(
  "/:courseId/registrations",
  isAuthenticated as any,
  isAdmin as any,
  asyncHandler((req: AuthRequest, res: Response) =>
    courseController.getCourseRegistrations(req, res)
  )
);

export default router;
