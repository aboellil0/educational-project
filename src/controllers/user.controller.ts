import { Request, Response } from "express";
import User, { IUser } from "../models/user.model";

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

export const getStudentsForTeacher = async (req: Request, res: Response) => {
    try {
        const teacherId = (req as any).user._id;

        const teacher = await User.findById(teacherId);
        if (!teacher || teacher.role !== 'teacher') {
            return res.status(403).json({ 
                success: false,
                message: "Access denied. User is not a teacher" 
            });
        }

        // Find all students for this teacher
        const students = await User.find({ role: 'student', teacherId })
            .select('-password')
            .sort('-createdAt'); // Optional: sort by creation date

        return res.status(200).json({
            success: true,
            message: "Students retrieved successfully",
            data: {
                students,
                total: students.length
            }
        });
    } catch (error) {
        return handleError(res, error, "retrieving students");
    }
}

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