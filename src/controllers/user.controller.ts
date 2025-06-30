import { Request, Response } from "express";
import User, { IUser } from "../models/user.model";
import Lesson,{ILesson} from "../models/lesson.model";
import LessonReport,{ILessonReport} from "../models/lessonReport.model";
// Custom error handler
const handleError = (res: Response, error: any, message: string) => {
    console.error(`Error ${message}:`, error);
    return res.status(500).json({ message: "Internal server error" });
};

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const user = await User.findById(userId).select('-password'); // Exclude password
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        return res.status(200).json({
            success: true,
            message: "User profile retrieved successfully",
            data: user,
        });
    } catch (error) {
        return handleError(res, error, "retrieving user profile");
    }
}

export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const updates = req.body;
        const allowedUpdates = ['name', 'email', 'phone'];
        
        // Validate update fields
        const updateFields = Object.keys(updates);
        const isValidOperation = updateFields.every(field => allowedUpdates.includes(field));
        
        if (!isValidOperation) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid updates!" 
            });
        }

        // Check if at least one field is provided
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ 
                success: false,
                message: "At least one field (name, email, phone) is required to update" 
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        // Update user fields
        updateFields.forEach(field => {
            (user as any)[field] = updates[field];
        });

        await user.save();

        return res.status(200).json({
            success: true,
            message: "User profile updated successfully",
            data: user,
        });
    } catch (error) {
        return handleError(res, error, "updating user profile");
    }
};
    
export const verifyUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ 
                success: false,
                message: "User ID is required" 
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        if (user.isVerified) {
            return res.status(400).json({ 
                success: false,
                message: "User is already verified" 
            });
        }

        user.isVerified = true;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "User verified successfully",
            data: user,
        });
    } catch (error) {
        return handleError(res, error, "verifying user");
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }
        await User.findByIdAndDelete(userId);
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        return handleError(res, error, "deleting user");
    }
}

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().select('-password').sort('-createdAt'); // Exclude password and sort by creation date
        return res.status(200).json({
            success: true,
            message: "All users retrieved successfully",
            data: {
                users,
                total: users.length
            }
        });
    } catch (error) {
        return handleError(res, error, "retrieving all users");
    }
}

export const getMylessons = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const user = await User.findById(userId).select('-password'); // Exclude password
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Assuming lessons are stored in a separate collection and linked to users
        const lessons = await Lesson.find({ userId }).sort('-scheduledAt'); // Sort by scheduled date
        
        return res.status(200).json({
            success: true,
            message: "User lessons retrieved successfully",
            data: lessons,
        });
    } catch (error) {
        return handleError(res, error, "retrieving user lessons");
    }
}

export const updateCredits = async (req: Request, res: Response) => {
    try {
        const { privateAmount, publicAmount, userId } = req.body;

        // Input validation
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        // Convert to numbers and validate
        const privateCredits = Number(privateAmount);
        const publicCredits = Number(publicAmount);

        if (privateCredits < 0 || publicCredits < 0) {
            return res.status(400).json({
                success: false,
                message: "Credit amounts cannot be negative"
            });
        }

        if (privateCredits === 0 && publicCredits === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one credit amount must be provided"
            });
        }

        // Find and update user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Update credits
        user.PrivitelessonCredits += privateCredits;
        user.PubliclessonCredits += publicCredits;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Credits updated successfully",
            data: {
                userId: user._id,
                privateCredits: user.PrivitelessonCredits,
                publicCredits: user.PubliclessonCredits
            }
        });
    } catch (error) {
        return handleError(res, error, "updating credits");
    }
}