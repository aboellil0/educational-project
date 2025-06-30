import express, { RequestHandler } from 'express';
import * as authController from '../controllers/auth.controller';
import { isAuthenticated } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.post('/register', authController.register as RequestHandler);
router.post('/login', authController.login as RequestHandler);
router.post('/logout', authController.logout as RequestHandler);
router.post('/refresh-token', authController.refreshToken as RequestHandler);
router.post('/verify-email', authController.verifyEmail as RequestHandler);
router.post('/forgot-password', authController.forgotPassword as RequestHandler);
router.post('/reset-password', authController.resetPassword as RequestHandler);
router.post('/google', authController.googleLogin as RequestHandler);

// Protected routes
router.get('/profile', isAuthenticated as RequestHandler, authController.getMe);

export default router;