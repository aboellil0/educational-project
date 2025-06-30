import express from 'express';
import { GroupController } from '../controllers/groupController';
import { auth, adminAuth, teacherAuth } from '../middleware/auth.middleware';

const router = express.Router();
const groupController = new GroupController();

// Create a new group (admin/teacher only)
router.post('/', teacherAuth, groupController.createGroup);

// Get group by ID
router.get('/:id', auth, groupController.getGroupById);

// Get all groups
router.get('/', auth, groupController.getAllGroups);

// Update group (admin/teacher only)
router.put('/:id', teacherAuth, groupController.updateGroup);

// Delete group (admin only)
router.delete('/:id', adminAuth, groupController.deleteGroup);

// Add member to group (admin/teacher only)
router.post('/:id/members', teacherAuth, groupController.addMemberToGroup);

// Remove member from group (admin/teacher only)
router.delete('/:id/members', teacherAuth, groupController.removeMemberFromGroup);

export default router;
