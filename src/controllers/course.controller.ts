import { Request, Response } from "express";
import LessonReport, { ILessonReport } from "../models/lessonReport.model";
import Lesson, { ILesson } from "../models/lesson.model";
import User, { IUser } from "../models/user.model";
import LessonGroup, { ILessonGroup } from "../models/lessonGroup.model";
import Teacher, { ITeacher } from "../models/teacher.model";
import ContactInfo, { IContactInfo } from "../models/contact.model";
import { Types } from "mongoose";
import { isVerified } from "../middleware/auth.middleware";
import Course, { ICourse } from "../models/course.model";

export class CourseController {
    // Get All Courses
    async getAllCourses(req: Request, res: Response) {
        try {
            const courses = await Course.find().populate('teacher').populate('students');
            return res.status(200).json(courses);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching courses', error });
        }
    }

    // Create a new course
    async createCourse(req: Request, res: Response) {
        try {
            const { title, description,linkId, telegramLink } = req.body;
            // Validate required fields
            if (!title || !description || !linkId || !telegramLink) {
                return res.status(400).json({ message: 'Title, description, linkId, and telegramLink are required' });
            }

            const newCourse = new Course({
                title,
                description,
                linkId,
                telegramLink,
                registrations: [],
                isActive: true
            });

            // Save the course to the database
            await newCourse.save();
            return res.status(201).json(newCourse);
        } catch (error) {
            return res.status(500).json({ message: 'Error creating course', error });
        }
    }

    // Update a course
    async updateCourse(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { title, description, linkId, telegramLink, isActive } = req.body;

            // Validate required fields
            if (!title || !description || !linkId || !telegramLink) {
                return res.status(400).json({ message: 'Title, description, linkId, and telegramLink are required' });
            }

            // Find the course by ID and update it
            const updatedCourse = await Course.findByIdAndUpdate(id, {
                title,
                description,
                linkId,
                telegramLink,
                isActive
            }, { new: true });

            if (!updatedCourse) {
                return res.status(404).json({ message: 'Course not found' });
            }

            return res.status(200).json(updatedCourse);
        } catch (error) {
            return res.status(500).json({ message: 'Error updating course', error });
        }
    }   

    // Delete a course
    async deleteCourse(req: Request, res: Response) {
        try {
            const { id } = req.params;

            // Find the course by ID and delete it
            const deletedCourse = await Course.findByIdAndDelete(id);

            if (!deletedCourse) {
                return res.status(404).json({ message: 'Course not found' });
            }

            return res.status(200).json({ message: 'Course deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting course', error });
        }
    }


    // Register a user for a course
    async registerForCourse(req: Request, res: Response) {
        try {
            const { courseId } = req.params;
            const { userName, email, phone, age, country, city } = req.body;
            const userId = (req as any).user._id;

            // Validate required fields
            if ( !userName || !email || !phone || !age || !country || !city) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            // Find the course by ID
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            // Add registration to the course
            course.registrations.push({
                userId: userId || '000000000000000000000000', 
                userName,
                email,
                phone,
                age,
                country,
                city,
                registeredAt: new Date()
            });

            // Save the updated course
            await course.save();
            return res.status(200).json(course);
        } catch (error) {
            return res.status(500).json({ message: 'Error registering for course', error });
        }
    }

    // Get course by ID
    async getCourseById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            // Find the course by ID and populate registrations
            const course = await Course.findById(id).populate('registrations.userId');
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            return res.status(200).json(course);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching course', error });
        }
    }

    // Get all registrations for a course
    async getCourseRegistrations(req: Request, res: Response) {
        try {
            const { courseId } = req.params;

            // Find the course by ID and populate registrations
            const course = await Course.findById(courseId).populate('registrations.userId');
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            return res.status(200).json(course.registrations);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching course registrations', error });
        }
    }

    // Get all active courses
    async getActiveCourses(req: Request, res: Response) {
        try {
            const activeCourses = await Course.find({ isActive: true }).populate('registrations.userId');
            return res.status(200).json(activeCourses);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching active courses', error });
        }
    }
}