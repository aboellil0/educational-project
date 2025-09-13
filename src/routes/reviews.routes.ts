import express, { RequestHandler } from 'express';
import * as reviewsController from '../controllers/reviews.controller';
import { isAuthenticated, isAdmin } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.post('/', reviewsController.createReview as RequestHandler);
router.get('/public', reviewsController.getPublicReviews as RequestHandler);
router.get('/:id', reviewsController.getReviewById as RequestHandler);

// Admin only routes
router.put('/:id', isAuthenticated as RequestHandler, isAdmin as RequestHandler, reviewsController.updateReview as RequestHandler);
router.delete('/:id', isAuthenticated as RequestHandler, isAdmin as RequestHandler, reviewsController.deleteReview as RequestHandler);
router.delete('/all', isAuthenticated as RequestHandler, isAdmin as RequestHandler, reviewsController.getAllReviews as RequestHandler);
router.patch('/:id/approve', isAuthenticated as RequestHandler, isAdmin as RequestHandler, reviewsController.approveReview as RequestHandler);

export default router;