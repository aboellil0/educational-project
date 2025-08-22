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

// Helper function to wrap async route handlers
const asyncHandler =
  (fn: Function) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Public routes
router.get(
  "/active",
  asyncHandler((req: Request, res: Response) =>
    courseController.getActiveCourses(req, res)
  )
);
router.get(
  "/",
  asyncHandler((req: Request, res: Response) =>
    courseController.getAllCourses(req, res)
  )
);
router.get(
  "/:id",
  asyncHandler((req: Request, res: Response) =>
    courseController.getCourseById(req, res)
  )
);
router.post(
  "/:courseId/register",
  asyncHandler((req: Request, res: Response) =>
    courseController.registerForCourse(req, res)
  )
);

// Protected routes (require authentication)

// Admin only routes
router.post(
  "/",
  isAuthenticated as any,
  isAdmin as any,
  asyncHandler((req: AuthRequest, res: Response) =>
    courseController.createCourse(req, res)
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

router.get(
  "/:courseId/registrations",
  isAuthenticated as any,
  isAdmin as any,
  asyncHandler((req: AuthRequest, res: Response) =>
    courseController.getCourseRegistrations(req, res)
  )
);

export default router;
