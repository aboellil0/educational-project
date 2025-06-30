import { Request, Response } from "express";
import LessonReport, { ILessonReport } from "../models/lessonReport.model";
import Lesson, { ILesson } from "../models/lesson.model";
import User, { IUser } from "../models/user.model";
import LessonGroup, { ILessonGroup } from "../models/lessonGroup.model";
import Teacher, { ITeacher } from "../models/teacher.model";
import ContactInfo, { IContactInfo } from "../models/contact.model";
import { Types } from "mongoose";
import { isVerified } from "../middleware/auth.middleware";


export class AdminController {
    // Get all lesson reports
    async getAllLessonReports(req: Request, res: Response) {
        try {
            const reports = await LessonReport.find().populate('lesson').populate('student').populate('teacher');
            return res.status(200).json(reports);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching lesson reports', error });
        }
    }

    async addMember(req: Request, res: Response) {
        try {
            const { name, email, password, phone, quranMemorized, numOfPartsofQuran } = req.body;

            // Validate required fields
            if (!name || !email || !password || !phone) {
                return res.status(400).json({ message: 'Name, email, password, and phone are required' });
            }

            const newMember = new User({
                name,
                email,
                password,
                phone,
                quranMemorized: quranMemorized || '',
                numOfPartsofQuran: numOfPartsofQuran || 0,
                role: 'student', // Default role
                isVerified: true,
            });
            await newMember.save();
            return res.status(201).json(newMember);
        } catch (error) {
            return res.status(500).json({ message: 'Error adding member', error });
        }
    }

    async updateMember(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, email, phone, quranMemorized, numOfPartsofQuran, isVerified } = req.body

            // Validate required fields
            if (!name || !email || !phone) {
                return res.status(400).json({ message: 'Name, email, and phone are required' });
            }
            // Find the member by ID
            const updatedMember = await User.findByIdAndUpdate(id, {
                name,
                email,
                phone,
                quranMemorized: quranMemorized || '',
                numOfPartsofQuran: numOfPartsofQuran || 0,
            });

            if (!updatedMember) {
                return res.status(404).json({ message: 'Member not found' });
            }

            // If isVerified is provided, update it
            if (typeof isVerified === 'boolean') {
                updatedMember.isVerified = isVerified;
                await updatedMember.save();
            }
            return res.status(200).json(updatedMember);
        } catch (error) {
            return res.status(500).json({ message: 'Error updating member', error });
        }
    }
}