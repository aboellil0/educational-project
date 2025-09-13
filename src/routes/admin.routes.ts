import express from 'express';
import { AdminController } from '../controllers/admin.controller';
import { isAdmin,isAdminOrTeacher,isAuthenticated } from '../middleware/auth.middleware';
import { 
    getUserProfile, 
    updateUserProfile, 
    verifyUser, 
    getAllUsers, 
    updateCredits 
} from '../controllers/user.controller';

const router = express.Router();
const adminController = new AdminController();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Administrative operations (Admin only)
 */

/**
 * @swagger
 * /admin/reports:
 *   get:
 *     summary: Get all lesson reports
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all lesson reports
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LessonReport'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/reports',isAuthenticated as any,isAdmin as any, adminController.getAllLessonReports as any);

/**
 * @swagger
 * /admin/members:
 *   post:
 *     summary: Add a new member
 *     tags: [Admin]
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
 *               - email
 *               - password
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Smith"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jane@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               age:
 *                 type: number
 *                 example: 30
 *               country:
 *                 type: string
 *                 example: "Canada"
 *               city:
 *                 type: string
 *                 example: "Toronto"
 *               quranMemorized:
 *                 type: string
 *                 example: "5 chapters"
 *               numOfPartsofQuran:
 *                 type: number
 *                 example: 5
 *     responses:
 *       201:
 *         description: Member added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post('/members', isAuthenticated as any,isAdmin as any, adminController.addMember as any);

/**
 * @swagger
 * /admin/members/{id}:
 *   put:
 *     summary: Update member information
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Member ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               age:
 *                 type: number
 *               freeLessonUsed:
 *                 type: boolean
 *               PrivitelessonCredits:
 *                 type: number
 *               PubliclessonCredits:
 *                 type: number
 *               quranMemorized:
 *                 type: string
 *               numOfPartsofQuran:
 *                 type: number
 *               isVerified:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Member updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Member not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.put('/members/:id', isAuthenticated as any,isAdmin as any, adminController.updateMember as any);

/**
 * @swagger
 * /admin/contact:
 *   put:
 *     summary: Update contact information
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               whatsappNumber:
 *                 type: string
 *               telegramLink:
 *                 type: string
 *               facebook:
 *                 type: string
 *               linkedin:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contact information updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactInfo'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *   get:
 *     summary: Get contact information
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Contact information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactInfo'
 *   post:
 *     summary: Create contact information
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               whatsappNumber:
 *                 type: string
 *               telegramLink:
 *                 type: string
 *               facebook:
 *                 type: string
 *               linkedin:
 *                 type: string
 *     responses:
 *       201:
 *         description: Contact information created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactInfo'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.put('/contact', isAuthenticated as any,isAdmin as any, adminController.updateContactInfo as any);
router.get('/contact', adminController.getContactInfo as any);
router.post('/contact', isAuthenticated as any,isAdmin as any, adminController.createContactInfo as any);

/**
 * @swagger
 * /admin/profile:
 *   get:
 *     summary: Get user profile (Admin/Teacher)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or Teacher access required
 *   put:
 *     summary: Update user profile
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               age:
 *                 type: number
 *               country:
 *                 type: string
 *               city:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/profile', isAuthenticated as any,isAdminOrTeacher as any, getUserProfile as any);
router.put('/profile', isAuthenticated as any,isAdmin as any, updateUserProfile as any);

/**
 * @swagger
 * /admin/verify:
 *   patch:
 *     summary: Verify a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
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
 *                 description: ID of the user to verify
 *     responses:
 *       200:
 *         description: User verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.patch('/verify', isAuthenticated as any,isAdmin as any, verifyUser as any);

/**
 * @swagger
 * /admin/member/{id}:
 *   delete:
 *     summary: Delete user account
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Member ID
 *     responses:
 *       200:
 *         description: Member deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Member not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.delete('/member/:id', isAuthenticated as any,isAdmin as any, adminController.deleteMember as any);

/**
 * @swagger
 * /admin/all:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/all', isAuthenticated as any,isAdmin as any, getAllUsers as any);

/**
 * @swagger
 * /admin/credits:
 *   patch:
 *     summary: Update user credits
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - credits
 *             properties:
 *               userId:
 *                 type: string
 *               credits:
 *                 type: number
 *     responses:
 *       200:
 *         description: Credits updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.patch('/credits', isAuthenticated as any,isAdmin as any, updateCredits as any);

/**
 * @swagger
 * /admin:
 *   post:
 *     summary: Create admin
 *     tags: [Admin]
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
 *               - email
 *               - password
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post('/',isAuthenticated as any,isAdmin as any,adminController.createAdmin as any)

/**
 * @swagger
 * /admin/addNumberOfLessonsCredits:
 *   post:
 *     summary: Add number of lessons credits for teacher
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teacherId
 *               - NOLessonCridets
 *             properties:
 *               teacherId:
 *                 type: string
 *                 description: Teacher ID
 *               NOLessonCridets:
 *                 type: number
 *                 description: Number of lesson credits to add
 *     responses:
 *       200:
 *         description: Lessons updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 teacher:
 *                   $ref: '#/components/schemas/Teacher'
 *       404:
 *         description: Teacher not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post('/addNumberOfLessonsCredits', isAuthenticated as any,isAdmin as any, adminController.addNumberOfLessonsCredits as any);

/**
 * @swagger
 * /admin/students:
 *   get:
 *     summary: Get all students
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all students
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/students', isAuthenticated as any,isAdmin as any, adminController.getAllStudents as any);

/**
 * @swagger
 * /admin/admins:
 *   get:
 *     summary: Get all admins
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all admins
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/admins', isAuthenticated as any,isAdmin as any, adminController.getAllAdmins as any);

/**
 * @swagger
 * /admin/admins/{id}:
 *   get:
 *     summary: Get admin by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin ID
 *     responses:
 *       200:
 *         description: Admin retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Admin not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/admins/:id', isAuthenticated as any,isAdmin as any, adminController.getAdminById as any);

export default router;