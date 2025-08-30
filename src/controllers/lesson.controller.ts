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
                .populate<{ groupId: { members: { name: string, email: string }[], name: string, type: string } }>({
                    path: 'groupId',
                    select: 'name type',
                    populate: {
                        path: 'members',
                        select: 'name email'
                    }
                });
                        
            if (!lesson) {
                return res.status(404).json({ message: 'Lesson not found' });
            }

            // Add the number of members to the response
            const responseData = {
                ...lesson.toObject(),
                memberCount: lesson.groupId.members?.length || 0
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
            const updatedLesson = await Lesson.findByIdAndUpdate(
                lessonId,
                { status: 'completed' },
                { new: true }
            );
            if (!updatedLesson) {
                return res.status(404).json({ message: 'Lesson not found' });
            }

            // minus one lesson credit from the teacher and the user
            const group = await LessonGroup.findById(updatedLesson.groupId);
            if (group) {
                const teacher = await Teacher.findById(group.teacherId);
                if (teacher) {
                    teacher.numberOflessonsCridets -= 1;
                    await teacher.save();
                }
                
                await Promise.all(group.members.map(async (memberId) => {
                    const member = await User.findById(memberId);
                    const report = await LessonReport.findOne({ sudentId: memberId, lessonId: updatedLesson._id});
                    if (member && member.role === 'student') {
                        if (report) {
                            report.attended = true;
                            await report.save();
                        } else {
                            const newReport = new LessonReport({
                                sudentId: memberId,
                                lessonId: updatedLesson._id,
                                attended: true
                            });
                            await newReport.save();
                        }
                        if (group.type === 'private') {
                            member.PrivitelessonCredits -= 1;
                            await member.save();
                        }
                        if (group.type === 'public') {
                            member.PubliclessonCredits -= 1;
                            await member.save();
                        }
                    }
                }));
            }
        } catch (error) {
            console.error('Error updating lesson credits:', error);
            return res.status(500).json({ message: 'Server error while updating lesson credits' });
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