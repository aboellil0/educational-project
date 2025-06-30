import { Request,Response } from "express";
import Lesson,{ ILesson } from "../models/lesson.model";
import Teacher,{ITeacher} from "../models/teacher.model";
import LessonGroup,{ILessonGroup} from "../models/lessonGroup.model";
import User from "../models/user.model";
import LessonReport from "../models/lessonReport.model";


export class TeacherController {

    async getTeachers(req: Request, res: Response): Promise<void> {
        try {
            const teachers: ITeacher[] = await Teacher.find();
            res.status(200).json(teachers);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving teachers", error });
        }
    }

    async getTeacherById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const teacher: ITeacher | null = await Teacher.findById(id);
            if (!teacher) {
                res.status(404).json({ message: "Teacher not found" });
                return;
            }
            res.status(200).json(teacher);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving teacher", error });
        }
    }

    async createTeacher(req: Request, res: Response): Promise<void> {
        const { name, email, password, phone,specialization,meetingLink,availability } = req.body;

        try {
            const newUser = new User({
                name,
                email,
                password,
                phone,
                role: 'teacher',
                numOfPartsofQuran: 0,
                quranMemorized: '',
                isVerified: true,
                freeLessonUsed: false,
                PrivitelessonCredits: 0,
                PubliclessonCredits: 0,
            });
            const newTeacher = new Teacher({
                user: newUser._id,
                specialization,
                meetingLink,
                availability
            });
            await newUser.save();
            await newTeacher.save();
            res.status(201).json(newTeacher);
        } catch (error) {
            res.status(500).json({ message: "Error creating teacher", error });
        }
    }

    async updateTeacher(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { specialization, meetingLink, availability } = req.body;

        try {
            const updatedTeacher: ITeacher | null = await Teacher.findByIdAndUpdate(
                id,
                { specialization, meetingLink, availability },
                { new: true }
            );
            if (!updatedTeacher) {
                res.status(404).json({ message: "Teacher not found" });
                return;
            }
            res.status(200).json(updatedTeacher);
        } catch (error) {
            res.status(500).json({ message: "Error updating teacher", error });
        }
    }

    async deleteTeacher(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        try {
            const deletedTeacher: ITeacher | null = await Teacher.findByIdAndDelete(id);
            if (!deletedTeacher) {
                res.status(404).json({ message: "Teacher not found" });
                return;
            }
            await User.findByIdAndDelete(deletedTeacher.userId);
            res.status(200).json({ message: "Teacher deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting teacher", error });
        }
    }

    async getTeacherLessons(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        try {
            const lessons: ILesson[] = await Lesson.find({ teacherId: id }).populate('groupId').populate('reportId');
            if (!lessons || lessons.length === 0) {
                res.status(404).json({ message: "No lessons found for this teacher" });
                return;
            }
            res.status(200).json(lessons);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving lessons", error });
        }
    }

    async getMyLessons(req: Request, res: Response): Promise<void> {
        const userId = (req as any).user._id; // Assuming req.user is populated with the authenticated user's info
        const teacherId = (await Teacher.findOne({ user: userId }))?._id;
        try {
            const lessons: ILesson[] = await Lesson.find({ teacherId }).populate('groupId').populate('reportId').populate('homework');
            if (!lessons || lessons.length === 0) {
                res.status(404).json({ message: "No lessons found for this teacher" });
                return;
            }
            res.status(200).json(lessons);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving lessons", error });
        }
    }

    async getTeacherGroups(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        try {
            const groups: ILessonGroup[] = await LessonGroup.find({ teacherId: id }).populate('teacherId').populate('students');
            if (!groups || groups.length === 0) {
                res.status(404).json({ message: "No groups found for this teacher" });
                return;
            }
            res.status(200).json(groups);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving groups", error });
        }
    }

    async getMyGroups(req: Request, res: Response): Promise<void> {
        const userId = (req as any).user._id; // Assuming req.user is populated with the authenticated user's info
        const teacherId = (await Teacher.findOne({ user: userId }))?._id;
        try {
            const groups: ILessonGroup[] = await LessonGroup.find({ teacherId }).populate('teacherId').populate('students');
            if (!groups || groups.length === 0) {
                res.status(404).json({ message: "No groups found for this teacher" });
                return;
            }
            res.status(200).json(groups);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving groups", error });
        }
    }
}