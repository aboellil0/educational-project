import User,{IUser} from "../models/user.model";
import Lesson,{ILesson} from "../models/lesson.model";
import Homework,{IHomework} from "../models/homework.model";
import { Request, Response } from "express";


export const getTeachers = async (req: Request, res: Response) => {
    try {
        const teachers = await User.find({ role: 'teacher' }).select('-password');
        return res.status(200).json({
            success: true,
            message: "Teachers retrieved successfully",
            data: teachers,
        });
    } catch (error) {
        console.error("Error retrieving teachers:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
}

export const getTeacherProfilebyId = async (req: Request, res: Response) => {
    try {
        const teacherId = req.params.id;
        const teacher = await User.findById(teacherId).select('-password');
        
        if (!teacher) {
            return res.status(404).json({ 
                success: false, 
                message: "Teacher not found" 
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Teacher profile retrieved successfully",
            data: teacher,
        });
    } catch (error) {
        console.error("Error retrieving teacher profile:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
}

// admin assing new teacher 
export const assignTeacher = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phone } = req.body;

        // Validate required fields
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ 
                success: false, 
                message: "All fields are required" 
            });
        }

        // Check if teacher already exists
        const existingTeacher = await User.findOne({ email });
        if (existingTeacher) {
            return res.status(400).json({ 
                success: false, 
                message: "Teacher with this email already exists" 
            });
        }

        // Create new teacher
        const newTeacher = new User({
            name,
            email,
            password,
            phone,
            role: 'teacher'
        });

        await newTeacher.save();

        return res.status(201).json({
            success: true,
            message: "Teacher assigned successfully",
            data: newTeacher,
        });
    } catch (error) {
        console.error("Error assigning teacher:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
}

export const deleteTeacher = async (req: Request, res: Response) => {
    try {
        const teacherId = req.params.id;

        // Check if teacher exists
        const teacher = await User.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ 
                success: false, 
                message: "Teacher not found" 
            });
        }

        // Delete teacher
        await User.findByIdAndDelete(teacherId);

        return res.status(200).json({
            success: true,
            message: "Teacher deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting teacher:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
}


export const getTeacherLessons = async (req: Request, res: Response) => {
    try {
        const teacherId = req.params.id;

        // Find lessons taught by the teacher
        const lessons = await Lesson.find({ teacher: teacherId });

        return res.status(200).json({
            success: true,
            message: "Lessons retrieved successfully",
            data: lessons,
        });
    } catch (error) {
        console.error("Error retrieving lessons:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
}

export const getTeacherHomework = async (req: Request, res: Response) => {
    try {
        const teacherId = req.params.id;

        // Find homework assigned by the teacher
        const homework = await Homework.find({ teacher: teacherId });

        return res.status(200).json({
            success: true,
            message: "Homework retrieved successfully",
            data: homework,
        });
    } catch (error) {
        console.error("Error retrieving homework:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
}