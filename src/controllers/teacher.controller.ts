import { Request,Response } from "express";
import Lesson,{ ILesson } from "../models/lesson.model";
import Teacher,{ITeacher} from "../models/teacher.model";
import LessonGroup,{ILessonGroup} from "../models/lessonGroup.model";
import User from "../models/user.model";
import LessonReport from "../models/lessonReport.model";


export class TeacherController {

    async getTeachers(req: Request, res: Response){
        try {
            const teachers: ITeacher[] = await Teacher.find().populate('userId', 'name email phone');
            const userTeacher = await User.find({ role: 'teacher' }).select('-password');
            return res.status(200).json({ teachers, userTeacher });
        } catch (error) {
            return res.status(500).json({ message: "Error retrieving teachers", error });
        }
    }

    async getTeacherById(req: Request, res: Response){
        const { id } = req.params;
        try {
            const teacher: ITeacher | null = await Teacher.findById(id).populate('userId', 'name email phone');
            if (!teacher) {
                return res.status(404).json({ message: "Teacher not found" });
            }
            const teacherUser = await User.findById(teacher.userId).select('-password');
            return res.status(200).json({ teacher, teacherUser });
        } catch (error) {
            return res.status(500).json({ message: "Error retrieving teacher", error });
        }
    }

    async createTeacher(req: Request, res: Response){
        const { name, email, password, phone, specialization, country, city, meetingLink, availability } = req.body;

        try {
            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User with this email already exists" });
            }

            const newUser = new User({
                name,
                email,
                password,
                phone,
                country,
                city,
                role: 'teacher',
                numOfPartsofQuran: 0,
                quranMemorized: '',
                isVerified: true,
                freeLessonUsed: false,
                PrivitelessonCredits: 0,
                PubliclessonCredits: 0,
            });
            await newUser.save();
            
            const newTeacher = new Teacher({
                userId: newUser._id,
                specialization,
                meetingLink,
                numberOflessonsCridets: 0, 
                availability
            });
            await newTeacher.save();
            
            // Populate the teacher data before returning
            const populatedTeacher = await Teacher.findById(newTeacher._id).populate('userId', 'name email phone');
            return res.status(201).json(populatedTeacher);
        } catch (error) {
            return res.status(500).json({ message: "Error creating teacher", error });
        }
    }

    async updateTeacher(req: Request, res: Response){
        const { id } = req.params;
        const { specialization, meetingLink, availability,name,email,phone,city,country } = req.body;

        try {
            const updatedTeacher: ITeacher | null = await Teacher.findByIdAndUpdate(
                id,
                { specialization, meetingLink, availability },
                { new: true }
            ).populate('userId', 'name email phone');
            
            if (!updatedTeacher) {
                return res.status(404).json({ message: "Teacher not found" });
            }
            const updateUser = await User.findByIdAndUpdate(updatedTeacher?.userId, { name, email, phone, city, country }, { new: true });
            if (!updateUser) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json({ updatedTeacher, updateUser });
        } catch (error) {
            return res.status(500).json({ message: "Error updating teacher", error });
        }
    }

    async deleteTeacher(req: Request, res: Response){
        const { id } = req.params;

        try {
            const deletedTeacher: ITeacher | null = await Teacher.findByIdAndDelete(id);
            if (!deletedTeacher) {
                return res.status(404).json({ message: "Teacher not found" });
            }
            
            // Delete the associated user account
            await User.findByIdAndDelete(deletedTeacher.userId);
            return res.status(200).json({ message: "Teacher deleted successfully" });
        } catch (error) {
            return res.status(500).json({ message: "Error deleting teacher", error });
        }
    }

    async getTeacherLessons(req: Request, res: Response){
        const { id } = req.params;

        try {
            // First find groups taught by this teacher
            const groups = await LessonGroup.find({ teacherId: id });
            const groupIds = groups.map(group => group._id);
            
            // Then find lessons for these groups
            const lessons: ILesson[] = await Lesson.find({ groupId: { $in: groupIds } })
                .populate('groupId', 'name type meetingLink')
                .populate('reportId');
                
            if (!lessons || lessons.length === 0) {
                return res.status(404).json({ message: "No lessons found for this teacher" });
            }
            return res.status(200).json(lessons);
        } catch (error) {
            return res.status(500).json({ message: "Error retrieving lessons", error });
        }
    }

    async getMyLessons(req: Request, res: Response) {
        const userId = (req as any).user._id;
        
        try {
            const teacher = await Teacher.findOne({ userId: userId });
            if (!teacher) {
                return res.status(404).json({ message: "Teacher profile not found" });
            }
            
            // Find groups taught by this teacher
            const groups = await LessonGroup.find({ teacherId: teacher._id });
            const groupIds = groups.map(group => group._id);
            
            // Find lessons for these groups
            const lessons: ILesson[] = await Lesson.find({ groupId: { $in: groupIds } })
                .populate('groupId', 'name type meetingLink')
                .populate('reportId')
                .populate('homework')
                .sort({ scheduledAt: -1 });
                
            if (!lessons || lessons.length === 0) {
                return res.status(404).json({ message: "No lessons found for this teacher" });
            }
            return res.status(200).json(lessons);
        } catch (error) {
            return res.status(500).json({ message: "Error retrieving lessons", error });
        }
    }

    async getTeacherGroups(req: Request, res: Response){
        const { id } = req.params;

        try {
            const groups: ILessonGroup[] = await LessonGroup.find({ teacherId: id })
                .populate('teacherId', 'userId specialization meetingLink')
                .populate('members', 'name email phone');
                
            if (!groups || groups.length === 0) {
                return res.status(404).json({ message: "No groups found for this teacher" });
            }
            return res.status(200).json(groups);
        } catch (error) {
            return res.status(500).json({ message: "Error retrieving groups", error });
        }
    }

    async getMyGroups(req: Request, res: Response){
        const userId = (req as any).user._id;
        
        try {
            const teacher = await Teacher.findOne({ userId: userId });
            if (!teacher) {
                return res.status(404).json({ message: "Teacher profile not found" });
            }
            
            const groups: ILessonGroup[] = await LessonGroup.find({ teacherId: teacher._id })
                .populate('teacherId', 'userId specialization meetingLink')
                .populate('members', 'name email phone')
                .populate('lessons');
                
            if (!groups || groups.length === 0) {
                return res.status(404).json({ message: "No groups found for this teacher" });
            }
            return res.status(200).json(groups);
        } catch (error) {
            return res.status(500).json({ message: "Error retrieving groups", error });
        }
    }
}