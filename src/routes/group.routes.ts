import express from 'express';
import { GroupController } from '../controllers/group.controller';
import { isAuthenticated, isAdmin, isTeacher, isAdminOrTeacher } from '../middleware/auth.middleware';
import Teacher from '../models/teacher.model';

const router = express.Router();
const groupController = new GroupController();

/**
 * @swagger
 * tags:
 *   name: Groups
 *   description: Group management endpoints
 */

/**
 * @swagger
 * /group:
 *   post:
 *     summary: Create a new group (admin only)
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - teacher
 *               - course
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Advanced Quran Study Group"
 *               teacher:
 *                 type: string
 *                 description: Teacher ID
 *                 example: "60f7c1b9e1d4b2a3c4e5f6a7"
 *               course:
 *                 type: string
 *                 description: Course ID
 *                 example: "60f7c1b9e1d4b2a3c4e5f6a8"
 *               maxMembers:
 *                 type: number
 *                 example: 15
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Group created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Group'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *   get:
 *     summary: Get all groups (admin/teacher only)
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all groups
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Group'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or Teacher access required
 */
router.post('/', isAuthenticated as any,isAdmin as any, groupController.createGroup as any);
router.get('/', isAuthenticated as any,isAdminOrTeacher as any, groupController.getAllGroups as any);

/**
 * @swagger
 * /group/{id}:
 *   get:
 *     summary: Get group by ID
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Group ID
 *     responses:
 *       200:
 *         description: Group retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Group'
 *       404:
 *         description: Group not found
 *       401:
 *         description: Unauthorized
 *   put:
 *     summary: Update group (admin only)
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Group ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               teacher:
 *                 type: string
 *                 description: Teacher ID
 *               course:
 *                 type: string
 *                 description: Course ID
 *               maxMembers:
 *                 type: number
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Group updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Group'
 *       404:
 *         description: Group not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *   delete:
 *     summary: Delete group (admin only)
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Group ID
 *     responses:
 *       200:
 *         description: Group deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Group not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/:id', isAuthenticated as any, groupController.getGroupById as any);
router.put('/:id', isAuthenticated as any,isAdmin as any, groupController.updateGroup as any);
router.delete('/:id', isAuthenticated as any,isAdmin as any, groupController.deleteGroup as any);

/**
 * @swagger
 * /group/{id}/members:
 *   post:
 *     summary: Add member to group (admin only)
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Group ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID to add to the group
 *                 example: "60f7c1b9e1d4b2a3c4e5f6a9"
 *     responses:
 *       200:
 *         description: Member added to group successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 group:
 *                   $ref: '#/components/schemas/Group'
 *       400:
 *         description: Validation error or group is full
 *       404:
 *         description: Group or user not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *   delete:
 *     summary: Remove member from group (admin only)
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Group ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID to remove from the group
 *                 example: "60f7c1b9e1d4b2a3c4e5f6a9"
 *     responses:
 *       200:
 *         description: Member removed from group successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 group:
 *                   $ref: '#/components/schemas/Group'
 *       404:
 *         description: Group or user not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post('/:id/members', isAuthenticated as any,isAdmin as any, groupController.addMemberToGroup as any);
router.delete('/:id/members', isAuthenticated as any,isAdmin as any, groupController.removeMemberFromGroup as any);

export default router;
