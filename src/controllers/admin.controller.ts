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
            const { name, email, password, phone, quranMemorized, county, city, age, numOfPartsofQuran } = req.body;

            // Validate required fields
            if (!name || !email || !password || !phone) {
                return res.status(400).json({ message: 'Name, email, password, phone, are required' });
            }

            const newMember = new User({
                name,
                email,
                password,
                phone,
                age,
                county,
                city,
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
            const { name, email, phone,password,age,freeLessonUsed,PrivitelessonCredits,PubliclessonCredits, quranMemorized, numOfPartsofQuran, isVerified } = req.body

            // Validate required fields
            if (!name || !email || !phone) {
                return res.status(400).json({ message: 'Name, email, and phone are required' });
            }
            // Find the member by ID
            const updatedMember = await User.findByIdAndUpdate(id, {
                name,
                email,
                phone,
                password,
                age,
                freeLessonUsed,
                PrivitelessonCredits,
                PubliclessonCredits,
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

    async createContactInfo(req: Request, res: Response) {
        try {
            const { email, phone, address, whatsappNumber, telegramLink, facebook, linkedin } = req.body;

            // Create a new contact info document
            const contactInfo = new ContactInfo({
                email,
                phone,
                address,
                whatsappNumber,
                telegramLink,
                facebook,
                linkedin
            });

            await contactInfo.save();
            return res.status(201).json(contactInfo);
        } catch (error) {
            return res.status(500).json({ message: 'Error creating contact information', error });
        }
    }

    async getContactInfo(req: Request, res: Response) {
        try {
            const contactInfo = await ContactInfo.findOne();
            return res.status(200).json(contactInfo);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching contact information', error });
        }
    }
    

    async updateContactInfo(req: Request, res: Response) {
        try {
            const { email, phone, address, whatsappNumber,telegramLink, facebook, linkedin } = req.body;
            
            // Find the first contact info document or create if none exists
            let contactInfo = await ContactInfo.findOne();
            if (!contactInfo) {
                contactInfo = new ContactInfo({});
            }

            // Update fields if provided
            if (email) contactInfo.email = email;
            if (phone) contactInfo.phone = phone;
            if (address) contactInfo.address = address;
            if (whatsappNumber) contactInfo.whatsappNumber = whatsappNumber;
            if (facebook) contactInfo.facebook = facebook;
            if (telegramLink) contactInfo.telegramLink = telegramLink;
            if (linkedin) contactInfo.linkedin = linkedin;

            await contactInfo.save();
            return res.status(200).json(contactInfo);
        } catch (error) {
            return res.status(500).json({ message: 'Error updating contact information', error });
        }
    }

    async createAdmin(req: Request, res: Response) {
        try {
            const { name, email, password, phone } = req.body;

            if (!name || !email || !password || !phone) {
                return res.status(400).json({ message: 'Name, email, password, and phone are required' });
            }

            const newAdmin = new User({
                name,
                email,
                password,
                phone,
                role: 'admin',
                isVerified: true,
            });

            await newAdmin.save();
            return res.status(201).json(newAdmin);
        } catch (error) {
            return res.status(500).json({ message: 'Error creating admin', error });
        }
    }

    // the teacher had number of lesson should make 
    async addNumberOfLessonsCredits(req: Request, res: Response) {
        try {
            const { teacherId, NOLessonCridets } = req.body;

            if (!teacherId || !NOLessonCridets) {
                return res.status(400).json({ message: 'Teacher ID and number of lesson credits are required' });
            }

            const teacher = await Teacher.findById(teacherId);
            if (!teacher) {
                return res.status(404).json({ message: 'Teacher not found' });
            }
            
            teacher.numberOflessonsCridets = (teacher.numberOflessonsCridets || 0) + NOLessonCridets;
            await teacher.save();
            return res.status(200).json({ message: 'Lessons updated successfully', teacher });

        } catch (error) {
            return res.status(500).json({ message: 'Error updating lessons', error });
        }
    }

    async getAllStudents(req: Request, res: Response) {
        try {
            const students = await User.find({ role: 'student' }).select('-password');
            return res.status(200).json(students);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching students', error });
        }
    }

    async deleteMember(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const member = await User.findByIdAndDelete(id);
            if (!member) {
                return res.status(404).json({ message: 'Member not found' });
            }
            return res.status(200).json({ message: 'Member deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting member', error });
        }
    }

    async getAllAdmins(req: Request, res: Response) {
        try {
            const admins = await User.find({ role: 'admin' }).select('-password');
            return res.status(200).json(admins);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching admins', error });
        }
    }

    async getAdminById(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const admin = await User.findById(id).select('-password');
            if (!admin || admin.role !== 'admin') {
                return res.status(404).json({ message: 'Admin not found' });
            }
            return res.status(200).json(admin);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching admin', error });
        }
    }
}