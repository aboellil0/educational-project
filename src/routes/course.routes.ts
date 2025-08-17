import { Router, Request, Response, NextFunction } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { isAdmin, isAdminOrTeacher, isAuthenticated } from '../middleware/auth.middleware';
import { CourseController } from '../controllers/course.controller';

// Add AuthRequest type import
interface AuthRequest extends Request {
    user?: any;
}

const router = Router();
const adminController = new AdminController();
const courseController = new CourseController();

// Helper function to wrap async route handlers
const asyncHandler = (fn: Function) => (req: Request | AuthRequest, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res)).catch(next);
};

// Public routes
router.get('/active', asyncHandler((req: Request, res: Response) => courseController.getActiveCourses(req, res)));
router.get('/:id', asyncHandler((req: Request, res: Response) => courseController.getCourseById(req, res)));
router.get('/', asyncHandler((req: Request, res: Response) => courseController.getAllCourses(req, res)));

// Protected routes (require authentication)
router.post('/:courseId/register', asyncHandler((req: AuthRequest, res: Response) => 
    courseController.registerForCourse(req, res)
));

// Admin only routes
router.post('/', isAdmin as any, asyncHandler((req: AuthRequest, res: Response) => 
    courseController.createCourse(req, res)
));

router.put('/:id', isAdmin as any, asyncHandler((req: AuthRequest, res: Response) => 
    courseController.updateCourse(req, res)
));

router.delete('/:id', isAdmin as any, asyncHandler((req: AuthRequest, res: Response) => 
    courseController.deleteCourse(req, res)
));

router.get('/:courseId/registrations', isAdmin as any, asyncHandler((req: AuthRequest, res: Response) => 
    courseController.getCourseRegistrations(req, res)
));

export default router;


