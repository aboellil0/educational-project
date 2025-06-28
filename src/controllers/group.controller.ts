

import { Request, Response } from 'express';
import LessonGroup, { ILessonGroup } from '../models/lessonGroup.model';
import User, { IUser } from '../models/user.model';
import { Types } from 'mongoose';

export const getGroupDetails = async (req: Request, res: Response) => {
    try {
        const groupId = req.params.id;
        const group = await LessonGroup.findById(groupId)
            .populate('members', '-password')
            .populate('teacher', '-password')
            .populate('lessons');

        if (!group) {
            return res.status(404).json({ success: false, message: 'Group not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'Group details retrieved successfully',
            data: group,
        });
    } catch (error) {
        console.error('Error retrieving group details:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export const getGroupMembers = async (req: Request, res: Response) => {
    try {
        const groupId = req.params.id;
        const group = await LessonGroup.findById(groupId).populate('members', '-password');

        if (!group) {
            return res.status(404).json({ success: false, message: 'Group not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'Group members retrieved successfully',
            data: group.members,
        });
    } catch (error) {
        console.error('Error retrieving group members:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export const getGroupLessons = async (req: Request, res: Response) => {
    try {
        const groupId = req.params.id;
        const group = await LessonGroup.findById(groupId).populate('lessons');

        if (!group) {
            return res.status(404).json({ success: false, message: 'Group not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'Group lessons retrieved successfully',
            data: group.lessons,
        });
    } catch (error) {
        console.error('Error retrieving group lessons:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }

}

export const CreateGroup = async (req: Request, res: Response) => {
    try {
        const { name, description, teacherId } = req.body;

        // Validate teacher existence
        const teacher = await User.findById(teacherId);
        if (!teacher || teacher.role !== 'teacher') {
            return res.status(404).json({ success: false, message: 'Teacher not found or invalid role' });
        }

        // Create new group
        const newGroup = new LessonGroup({
            name,
            description,
            teacher: teacherId,
            members: [],
            lessons: []
        });

        await newGroup.save();

        return res.status(201).json({
            success: true,
            message: 'Group created successfully',
            data: newGroup,
        });
    } catch (error) {
        console.error('Error creating group:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export const addMemberToGroup = async (req: Request, res: Response) => {
    try {
        const { groupId, memberId } = req.body;

        // Validate group existence
        const group = await LessonGroup.findById(groupId);
        if (!group) {
            return res.status(404).json({ success: false, message: 'Group not found' });
        }

        // Validate member existence
        const member = await User.findById(memberId);
        if (!member || member.role !== 'student') {
            return res.status(404).json({ success: false, message: 'Member not found or invalid role' });
        }
        // Check if member is already in the group
        if (group.members.includes(memberId)) {
            return res.status(400).json({ success: false, message: 'Member already in the group' });
        }
        // Add member to group
        group.members.push(memberId);
        await group.save();
        return res.status(200).json({
            success: true,
            message: 'Member added to group successfully',
            data: group,
        });
    } catch (error) {
        console.error('Error adding member to group:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export const updateGroupDetails = async (req: Request, res: Response) => {
    try {
        const groupId = req.params.id;
        const { name, description } = req.body;

        // Validate group existence
        const group = await LessonGroup