import express from 'express';
import { GroupController } from '../controllers/group.controller';
import { isAuthenticated, isAdmin, isTeacher, isAdminOrTeacher } from '../middleware/auth.middleware';
import Teacher from '../models/teacher.model';

const router = express.Router();
const groupController = new GroupController();

// Create a new group (admin only)
router.post('/', isAuthenticated as any,isAdmin as any, groupController.createGroup as any);

// Get group by ID
router.get('/:id', isAuthenticated as any, groupController.getGroupById as any);

// Get all groups (admin/teacher only)
router.get('/', isAuthenticated as any,isAdminOrTeacher as any, groupController.getAllGroups as any);

// Update group (admin only)
router.put('/:id', isAuthenticated as any,isAdmin as any, groupController.updateGroup as any);

// Delete group (admin only)
router.delete('/:id', isAuthenticated as any,isAdmin as any, groupController.deleteGroup as any);

// Add member to group (admin only)
router.post('/:id/members', isAuthenticated as any,isAdmin as any, groupController.addMemberToGroup as any);

// Remove member from group (admin only)
router.delete('/:id/members', isAuthenticated as any,isAdmin as any, groupController.removeMemberFromGroup as any);

export default router;
