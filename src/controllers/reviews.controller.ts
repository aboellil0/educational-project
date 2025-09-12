import { Request, Response } from 'express';
import Reviews, { Ireviews } from '../models/reviews.model';
import { AuthRequest } from '../middleware/auth.middleware';

// Create a new review
export const createReview = async (req: Request, res: Response) => {
  try {
    const { name, rating, txt, hide } = req.body;

    if (!name || !txt) {
      return res.status(400).json({ message: 'Name and text are required' });
    }

    const review = new Reviews({
      name,
      rating,
      txt,
      hide,
      adminAccepted: false
    });

    await review.save();

    res.status(201).json({
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error while creating review' });
  }
};

// Get all reviews (public - only show non-hidden and admin accepted)
export const getPublicReviews = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Reviews.find({
      hide: false,
      adminAccepted: true
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const total = await Reviews.countDocuments({
      hide: false,
      adminAccepted: true
    });

    res.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get public reviews error:', error);
    res.status(500).json({ message: 'Server error while fetching reviews' });
  }
};

// Get all reviews (admin only - show all reviews)
export const getAllReviews = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Reviews.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Reviews.countDocuments();

    res.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({ message: 'Server error while fetching reviews' });
  }
};

// Get review by ID
export const getReviewById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const review = await Reviews.findById(id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ review });
  } catch (error) {
    console.error('Get review by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching review' });
  }
};

// Update review (admin only)
export const updateReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, rating, txt, hide, adminAccepted } = req.body;

    const review = await Reviews.findById(id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Update fields if provided
    if (name !== undefined) review.name = name;
    if (rating !== undefined) review.rating = rating;
    if (txt !== undefined) review.txt = txt;
    if (hide !== undefined) review.hide = hide;
    if (adminAccepted !== undefined) review.adminAccepted = adminAccepted;

    await review.save();

    res.json({
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Server error while updating review' });
  }
};

// Delete review (admin only)
export const deleteReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const review = await Reviews.findById(id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await Reviews.findByIdAndDelete(id);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error while deleting review' });
  }
};

// Approve review (admin only)
export const approveReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const review = await Reviews.findById(id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.adminAccepted = true;
    await review.save();

    res.json({
      message: 'Review approved successfully',
      review
    });
  } catch (error) {
    console.error('Approve review error:', error);
    res.status(500).json({ message: 'Server error while approving review' });
  }
};
