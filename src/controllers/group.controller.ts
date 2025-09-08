import { Request, Response } from 'express';
import { Types, Schema } from 'mongoose';
import LessonGroup from '../models/lessonGroup.model';
import User from '../models/user.model';
import Lesson from '../models/lesson.model';
import Teacher from '../models/teacher.model';

export class GroupController {

    async createGroup(req: Request, res: Response) {
        try{
            const { name, description, type, teacherId, members, meetingLink, usualDate } = req.body;

            // Validate teacherId
            if (!Types.ObjectId.isValid(teacherId)) {
                return res.status(400).json({ message: 'Invalid teacher ID' });
            }

            // Check if teacher exists
            const teacher = await Teacher.findById(teacherId);
            if (!teacher) {
                return res.status(404).json({ message: 'Teacher not found or not a valid teacher' });
            }

            // Create new lesson group
            const newGroup = new LessonGroup({
                name,
                description,
                type,
                teacherId,
                members: members || [],
                meetingLink,
                usualDate: usualDate,
                isActive: true
            });

            await newGroup.save();
            res.status(201).json(newGroup);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }

    async getGroupById(req: Request, res: Response) {
        try {
            const groupId = req.params.id;

            // Validate groupId
            if (!Types.ObjectId.isValid(groupId)) {
                return res.status(400).json({ message: 'Invalid group ID' });
            }

            const group = await LessonGroup.findById(groupId)
                .populate({
                    path: 'teacherId',
                    populate: {
                        path: 'userId',
                        select: 'name email'
                    }
                })
                .populate('members', 'name email PrivitelessonCredits PubliclessonCredits')
                .populate('lessons');

            if (!group) {
                return res.status(404).json({ message: 'Group not found' });
            }

            // Filter members with credits >= 1
            const eligibleMembers = group.members.filter((member: any) => 
                (member.PrivitelessonCredits && member.PrivitelessonCredits >= 1) ||
                (member.PubliclessonCredits && member.PubliclessonCredits >= 1)
            );

            const response = {
                group: {
                    ...group.toObject(),
                    members: eligibleMembers, // Only members with credits >= 1
                    totalEligibleMembers: eligibleMembers.length,
                    allMembers: group.members // Keep all members if needed
                }
            };

            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }
    async getAllGroups(req: Request, res: Response) {
        try {
            const groups = await LessonGroup.find()
                .populate({
                    path: 'teacherId',
                    populate: {
                        path: 'userId', // assuming Teacher model has userId field referencing User
                        select: 'name email'
                    }
                })
                .populate('lessons');
            
            res.status(200).json(groups);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }
    async deleteGroup(req: Request, res: Response) {
        try {
            const groupId = req.params.id;

            // Validate groupId
            if (!Types.ObjectId.isValid(groupId)) {
                return res.status(400).json({ message: 'Invalid group ID' });
            }

            const deletedGroup = await LessonGroup.findByIdAndDelete(groupId);
            const deletedLessons = await Lesson.deleteMany({ groupId });

            if (!deletedGroup) {
                return res.status(404).json({ message: 'Group not found' });
            }

            res.status(200).json({ message: 'Group deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }
    async updateGroup(req: Request, res: Response) {
        try {
            const groupId = req.params.id;
            const { name, description, type, teacherId, meetingLink, usualDate } = req.body;

            // Validate groupId
            if (!Types.ObjectId.isValid(groupId)) {
                return res.status(400).json({ message: 'Invalid group ID' });
            }

            const updatedGroup = await LessonGroup.findByIdAndUpdate(
                groupId,
                { name, description, type, teacherId, meetingLink, usualDate },
                { new: true }
            );

            if (!updatedGroup) {
                return res.status(404).json({ message: 'Group not found' });
            }

            res.status(200).json(updatedGroup);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }

    async addMemberToGroup(req: Request, res: Response) {
        try {
            const groupId = req.params.id;
            const { memberId } = req.body;

            // Validate groupId and memberId
            if (!Types.ObjectId.isValid(groupId) || !Types.ObjectId.isValid(memberId)) {
                return res.status(400).json({ message: 'Invalid group ID or member ID' });
            }

            const group = await LessonGroup.findById(groupId);
            if (!group) {
                return res.status(404).json({ message: 'Group not found' });
            }

            // Check if member already exists in the group
            if (group.members.includes(memberId)) {
                return res.status(400).json({ message: 'Member already exists in the group' });
            }

            group.members.push(memberId);
            await group.save();

            res.status(200).json(group);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }

    async removeMemberFromGroup(req: Request, res: Response) {
        try {
            const groupId = req.params.id;
            const { memberId } = req.body;

            // Validate groupId and memberId
            if (!Types.ObjectId.isValid(groupId) || !Types.ObjectId.isValid(memberId)) {
                return res.status(400).json({ message: 'Invalid group ID or member ID' });
            }

            const group = await LessonGroup.findById(groupId);
            if (!group) {
                return res.status(404).json({ message: 'Group not found' });
            }

            // Check if member exists in the group
            if (!group.members.includes(memberId)) {
                return res.status(400).json({ message: 'Member does not exist in the group' });
            }

            group.members = group.members.filter(member => member.toString() !== memberId.toString());
            await group.save();

            res.status(200).json(group);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }
}