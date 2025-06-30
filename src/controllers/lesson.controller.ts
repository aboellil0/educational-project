import { Request, Response } from 'express';
import { Schema, Types } from 'mongoose';
import Lesson from '../models/lesson.model';
import User from '../models/user.model';
import LessonGroup from '../models/lessonGroup.model';
import LessonReport from '../models/lessonReport.model';


export class LessonController {
    async getLessonById(req: Request, res: Response) {
        try {
            const lessonId = req.params.id;
            if (!Types.ObjectId.isValid(lessonId)) {
                return res.status(400).json({ message: 'Invalid lesson ID' });
            }

            const lesson = await Lesson.findById(lessonId)
                .populate('groupId', 'name description type teacherId members meetingLink usualDate')
                .populate('teacherId', 'name email')
                .populate('members', 'name email');

            if (!lesson) {
                return res.status(404).json({ message: 'Lesson not found' });
            }

            res.status(200).json(lesson);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }
    
    async getLessonsByGroup(req: Request, res: Response) {
        try {
            const groupId = req.params.id;
            if (!Types.ObjectId.isValid(groupId)) {
                return res.status(400).json({ message: 'Invalid group ID' });
            }

            const lessons = await Lesson.find({ groupId })
                .populate('groupId', 'name description type teacherId members meetingLink usualDate')
                .populate('teacherId', 'name email')
                .populate('members', 'name email');

            res.status(200).json(lessons);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }

    async addlessonToGroup(req: Request, res: Response) {
        try {
            const groupId = req.params.id;
            let { subject, scheduledAt, meetingLink } = req.body;
            // create new lessons to the group 
            const group = await LessonGroup.findById(groupId);
            if (!group) {
                return res.status(404).json({ message: 'Group not found' });
            }

            if(meetingLink ==null)
            {
                meetingLink = group.meetingLink;
            }
            const newLesson = new Lesson({
                groupId: group._id,
                subject,
                scheduledAt,
                meetingLink,
                status: 'scheduled'
            });
            await newLesson.save();
            group.lessons.push(newLesson._id as any);
            await group.save();
            res.status(200).json(group);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }

    async addHomewrok(req: Request, res: Response) {
        try {
            const lessonId = req.params.id;
            if (!Types.ObjectId.isValid(lessonId)) {
                return res.status(400).json({ message: 'Invalid lesson ID' });
            }

            const { homework } = req.body;

            const updatedLesson = await Lesson.findByIdAndUpdate(
                lessonId,
                { homework },
                { new: true }
            )
            .populate('groupId', 'name description type teacherId members meetingLink usualDate')
            .populate('teacherId', 'name email')
            .populate('members', 'name email');

            if (!updatedLesson) {
                return res.status(404).json({ message: 'Lesson not found' });
            }

            res.status(200).json(updatedLesson);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }

    async getLessonHomework(req: Request, res: Response) {
        try {
            const lessonId = req.params.id;
            if (!Types.ObjectId.isValid(lessonId)) {
                return res.status(400).json({ message: 'Invalid lesson ID' });
            }

            const lesson = await Lesson.findById(lessonId)
                .populate('groupId', 'name description type teacherId members meetingLink usualDate')
                .populate('teacherId', 'name email')
                .populate('members', 'name email');

            if (!lesson) {
                return res.status(404).json({ message: 'Lesson not found' });
            }

            res.status(200).json({ homework: lesson.homework });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }

    async updateLesson(req: Request, res: Response) {
        try {
            const lessonId = req.params.id;
            if (!Types.ObjectId.isValid(lessonId)) {
                return res.status(400).json({ message: 'Invalid lesson ID' });
            }

            const { subject, scheduledAt, meetingLink, homework } = req.body;

            const updatedLesson = await Lesson.findByIdAndUpdate(
                lessonId,
                { subject, scheduledAt, meetingLink, homework },
                { new: true }
            )
            .populate('groupId', 'name description type teacherId members meetingLink usualDate')
            .populate('teacherId', 'name email')
            .populate('members', 'name email');

            if (!updatedLesson) {
                return res.status(404).json({ message: 'Lesson not found' });
            }

            res.status(200).json(updatedLesson);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }

    async deleteLesson(req: Request, res: Response) {
        try {
            const lessonId = req.params.id;
            if (!Types.ObjectId.isValid(lessonId)) {
                return res.status(400).json({ message: 'Invalid lesson ID' });
            }

            const deletedLesson = await Lesson.findByIdAndDelete(lessonId);
            if (!deletedLesson) {
                return res.status(404).json({ message: 'Lesson not found' });
            }

            // Optionally, remove the lesson from the group
            const group = await LessonGroup.findById(deletedLesson.groupId);
            if (group) {
                group.lessons = group.lessons.filter(lesson => lesson.toString() !== deletedLesson._id.toString());
                await group.save();
            }

            res.status(200).json({ message: 'Lesson deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
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

    async createLessonReport(req: Request, res: Response) {
        try {
            const lessonId = req.params.id;
            const { studentId, attended, content, newMemorized } = req.body;

            if (!Types.ObjectId.isValid(lessonId) || !Types.ObjectId.isValid(studentId)) {
                return res.status(400).json({ message: 'Invalid IDs provided' });
            }

            const newReport = new LessonReport({

                lessonId,
                studentId,
                attended,
                content,
                newMemorized
            });

            await newReport.save();
            res.status(201).json(newReport);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }
}