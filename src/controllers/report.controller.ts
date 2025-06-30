import { Request,Response } from "express";
import LessonReport, { ILessonReport } from "../models/lessonReport.model";
import Lesson from "../models/lesson.model";
import User from "../models/user.model";
import Teacher from "../models/teacher.model";
import { Types } from "mongoose";


export class ReportController {

    async createReport(req: Request, res: Response) {
        try {
            const { lessonId } = req.params;
            const { studentId, attended, content, newMemorized, notes, rating } = req.body;

            // Validate lessonId and studentId
            if (!lessonId || !studentId) {
                return res.status(400).json({ message: "Lesson ID and Student ID are required" });
            }

            // Check if the lesson exists
            const lesson = await Lesson.findById(lessonId);
            if (!lesson) {
                return res.status(404).json({ message: "Lesson not found" });
            }

            // Check if the student exists
            const student = await User.findById(studentId);
            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }

            // Create a new report
            const report = new LessonReport({
                lessonId,
                sudentId: student._id,
                attended,
                content,
                newMemorized,
                notes,
                rating
            });

            await report.save();
            res.status(201).json(report);
        } catch (error) {
            res.status(500).json({ message: "Server error", error });
        }
    }

    async getLessonReports(req: Request, res: Response) {
        try {
            const lessonId = req.params.id;
            if (!Types.ObjectId.isValid(lessonId)) {
                return res.status(400).json({ message: 'Invalid lesson ID' });
            }

            const reports = await LessonReport.find({ lessonId })
                .populate('studentId', 'name email')
                .populate('teacherId', 'name email');

            if (!reports) {
                return res.status(404).json({ message: 'No reports found for this lesson' });
            }

            res.status(200).json(reports);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }

    async getLessonReportById(req: Request, res: Response) {
        try {
            const reportId = req.params.id;
            if (!Types.ObjectId.isValid(reportId)) {
                return res.status(400).json({ message: 'Invalid report ID' });
            }

            const report = await LessonReport.findById(reportId)
                .populate('studentId', 'name email')
                .populate('teacherId', 'name email');

            if (!report) {
                return res.status(404).json({ message: 'Report not found' });
            }

            res.status(200).json(report);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }

    async updateReport(req: Request, res: Response) {
        try {
            const reportId = req.params.id;
            if (!Types.ObjectId.isValid(reportId)) {
                return res.status(400).json({ message: 'Invalid report ID' });
            }

            const { attended, content, newMemorized, notes, rating, doneHomework } = req.body;

            const updatedReport = await LessonReport.findByIdAndUpdate(
                reportId,
                { attended, content, newMemorized, notes, rating, doneHomework },
                { new: true }
            ).populate('studentId', 'name email').populate('teacherId', 'name email');

            if (!updatedReport) {
                return res.status(404).json({ message: 'Report not found' });
            }

            res.status(200).json(updatedReport);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }

    async doneHomework(req: Request, res: Response) {
        try {
            const { reportId } = req.params;
            if (!Types.ObjectId.isValid(reportId)) {
                return res.status(400).json({ message: 'Invalid report ID' });
            }

            const report = await LessonReport.findById(reportId);
            if (!report) {
                return res.status(404).json({ message: 'Report not found' });
            }

            // Mark the homework as done
            report.doneHomework = true;
            await report.save();

            res.status(200).json({ message: 'Homework marked as done', report });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }

    async getStudentReports(req: Request, res: Response) {
        try {
            const studentId = req.params.id;
            if (!Types.ObjectId.isValid(studentId)) {
                return res.status(400).json({ message: 'Invalid student ID' });
            }

            const reports = await LessonReport.find({ studentId })
                .populate('lessonId', 'title date time');

            if (!reports) {
                return res.status(404).json({ message: 'No reports found for this student' });
            }

            res.status(200).json(reports);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }
}