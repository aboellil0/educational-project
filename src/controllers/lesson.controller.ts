// GET /api/lessons/schedule
// POST /api/lessons/book
// PUT /api/lessons/:id/report
// GET /api/lessons/:id/join


import { Request, Response } from 'express';
import Lesson,{ILesson} from '../models/lesson.model';

export const bookLesson = async (req: Request, res: Response) => {
    try {
        const { studentId, teacherId, date, time } = req.body;

        // Validate required fields
        if (!studentId || !teacherId || !date || !time) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Create new lesson
        const lesson = new Lesson({
            studentId,
            teacherId,
            date,
            time,
            status: 'booked', // Default status
        });

        await lesson.save();

        return res.status(201).json({
            success: true,
            message: "Lesson booked successfully",
            data: lesson,
        });
    } catch (error) {
        console.error("Error booking lesson:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const getLessonsSchedule = async (req: Request, res: Response) => {
    try {
        const lessons = await Lesson.find().sort({ date: 1 });
        return res.status(200).json({
            success: true,
            message: "Lessons schedule retrieved successfully",
            data: lessons,
        });
    } catch (error) {
        console.error("Error retrieving lessons schedule:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

