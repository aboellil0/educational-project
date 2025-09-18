import { Request, Response } from 'express';
import { Schema, Types } from 'mongoose';
import Lesson from '../models/lesson.model';
import User from '../models/user.model';
import LessonGroup from '../models/lessonGroup.model';
import LessonReport from '../models/lessonReport.model';
import Teacher from '../models/teacher.model';


export class LessonController {
    async getLessonById(req: Request, res: Response) {
        try {
            const lessonId = req.params.id;
            if (!Types.ObjectId.isValid(lessonId)) {
                return res.status(400).json({ message: 'Invalid lesson ID' });
            }

            // get the lesson details with the members name and id and email
            const lesson = await Lesson.findById(lessonId)
                .populate<{ groupId: { members: { name: string, email: string, PrivitelessonCredits: number, PubliclessonCredits: number }[], name: string, type: string } }>({
                    path: 'groupId',
                    select: 'name type',
                    populate: {
                        path: 'members',
                        select: 'name email PrivitelessonCredits PubliclessonCredits'
                    }
                });
                        
            if (!lesson) {
                return res.status(404).json({ message: 'Lesson not found' });
            }

            // Filter out students who have no credits (both private and public are 0)
            const membersWithCredits = lesson.groupId.members?.filter(member => 
                member.PrivitelessonCredits > 0 || member.PubliclessonCredits > 0
            ) || [];

            // Add the number of members with credits to the response
            const responseData = {
                ...lesson.toObject(),
                groupId: {
                    ...lesson.groupId,
                    members: membersWithCredits
                },
                memberCount: membersWithCredits.length
            };

            res.status(200).json(responseData);
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
                .populate('groupId', 'name description type teacherId members meetingLink usualDate');

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
            .populate('groupId');

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

    async completeLesson(req: Request, res: Response) {
        try {
            const lessonId = req.params.id;

            if (!Types.ObjectId.isValid(lessonId)) {
                return res.status(400).json({ message: 'Invalid lesson ID' });
            }

            const lesson = await Lesson.findById(lessonId);
            if (!lesson) {
                return res.status(404).json({ message: 'Lesson not found' });
            }

            // Get the group and populate members
            const group = await LessonGroup.findById(lesson.groupId).populate('members');
            if (!group) {
                return res.status(404).json({ message: 'Group not found' });
            }

            // Get all students in the group who have credits
            const studentsWithCredits = await User.find({
                _id: { $in: group.members },
                role: 'student',
                $or: [
                    { PrivitelessonCredits: { $gt: 0 } },
                    { PubliclessonCredits: { $gt: 0 } }
                ]
            });

            if (studentsWithCredits.length === 0) {
                return res.status(400).json({ message: 'No students with sufficient credits found in this group' });
            }

            const completedStudents = [];
            const failedStudents = [];
            let teacherCreditsAdded = 0;

            // Process each student
            for (const student of studentsWithCredits) {
                try {
                    // Deduct lesson credits from the student
                    if (student.PrivitelessonCredits > 0) {
                        student.PrivitelessonCredits -= 1;
                    } else if (student.PubliclessonCredits > 0) {
                        student.PubliclessonCredits -= 1;
                    }
                    await student.save();

                    teacherCreditsAdded += 1;

                    completedStudents.push({
                        studentId: student._id,
                        name: student.name,
                        remainingCredits: {
                            private: student.PrivitelessonCredits,
                            public: student.PubliclessonCredits
                        }
                    });

                } catch (error) {
                    failedStudents.push({
                        studentId: student._id,
                        name: student.name,
                        reason: 'Error processing student completion'
                    });
                }
            }

            // Add credits to teacher
            const teacher = await Teacher.findById(group.teacherId);
            if (teacher && teacherCreditsAdded > 0) {
                teacher.numberOflessonsCridets += teacherCreditsAdded;
                await teacher.save();
            }

            // Update lesson status to completed
            lesson.status = 'completed';
            await lesson.save();

            return res.status(200).json({ 
                message: 'Lesson completion processed for all eligible students',
                lessonId: lessonId,
                summary: {
                    totalEligibleStudents: studentsWithCredits.length,
                    completedSuccessfully: completedStudents.length,
                    failed: failedStudents.length,
                    teacherCreditsAdded: teacherCreditsAdded
                },
                completedStudents: completedStudents,
                failedStudents: failedStudents
            });

        } catch (error) {
            console.error('Error completing lesson for all students:', error);
            return res.status(500).json({ message: 'Server error while completing lesson' });
        }
    }

    async updateLessonStatus(req: Request, res: Response) {
        try {
            const lessonId = req.params.id;
            if (!Types.ObjectId.isValid(lessonId)) {
                return res.status(400).json({ message: 'Invalid lesson ID' });
            }

            const lesson = await Lesson.findById(lessonId);
            if (!lesson) {
                return res.status(404).json({ message: 'Lesson not found' });
            }
            if (lesson.status === 'completed') {
                return res.status(400).json({ message: 'Cannot update status of a completed lesson' });
            }

            const { status, newdate } = req.body;
            if (!['scheduled', 'in_progress', 'completed', 'cancelled'].includes(status)) {
                return res.status(400).json({ message: 'Invalid status' });
            }

            if (status === 'completed') {
                return this.completeLesson(req, res);
            }

            const updateData: any = { status };
            if (status === 'scheduled' && newdate) {
                const newScheduledAt = new Date(newdate);
                if (isNaN(newScheduledAt.getTime())) {
                    return res.status(400).json({ message: 'Invalid date format' });
                }
                updateData.scheduledAt = newScheduledAt;
            }

            const updatedLesson = await Lesson.findByIdAndUpdate(
                lessonId,
                updateData,
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
            res.status(500).json({ message: '', error });
        }
    }

}