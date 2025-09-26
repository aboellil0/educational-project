import { Request, Response } from "express";
import User, { IUser } from "../models/user.model";
import Lesson,{ILesson} from "../models/lesson.model";
import LessonReport,{ILessonReport} from "../models/lessonReport.model";
import LessonGroup from "../models/lessonGroup.model";
import Teacher from "../models/teacher.model";
// Custom error handler
const handleError = (res: Response, error: any, message: string) => {
    console.error(`Error ${message}:`, error);
    return res.status(500).json({ message: "Internal server error" });
};

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const userRole = (req as any).user.role;
        const user = await User.findById(userId).select('-password'); // Exclude password
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        if (userRole === 'teacher') {
            // if the user is teacher get all the teacher information from teacher model additional it's user information
            const teacher = await Teacher.findOne({ userId: userId }).populate('userId', '-password');
            if (!teacher) {
                return res.status(404).json({ message: "Teacher profile not found" });
            }
            return res.status(200).json({
                success: true,   
                message: "Teacher profile retrieved successfully",
                data: { teacher, user },
                userRole: userRole
            });
        }   

        return res.status(200).json({
            success: true,
            message: "User profile retrieved successfully",
            data: user,
            userRole: userRole
        });
    } catch (error) {
        return handleError(res, error, "retrieving user profile");
    }
}

export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const updates = req.body;
        const allowedUpdates = ['name', 'email', 'phone'];
        
        // Validate update fields
        const updateFields = Object.keys(updates);
        const isValidOperation = updateFields.every(field => allowedUpdates.includes(field));
        
        if (!isValidOperation) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid updates!" 
            });
        }

        // Check if at least one field is provided
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ 
                success: false,
                message: "At least one field (name, email, phone) is required to update" 
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        // Update user fields
        updateFields.forEach(field => {
            (user as any)[field] = updates[field];
        });

        await user.save();

        return res.status(200).json({
            success: true,
            message: "User profile updated successfully",
            data: user,
        });
    } catch (error) {
        return handleError(res, error, "updating user profile");
    }
};
    
export const verifyUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ 
                success: false,
                message: "User ID is required" 
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        if (user.isVerified) {
            return res.status(400).json({ 
                success: false,
                message: "User is already verified" 
            });
        }

        user.isVerified = true;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "User verified successfully",
            data: user,
        });
    } catch (error) {
        return handleError(res, error, "verifying user");
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }
        await User.findByIdAndDelete(userId);
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        return handleError(res, error, "deleting user");
    }
}

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().select('-password').sort('-createdAt'); // Exclude password and sort by creation date
        return res.status(200).json({
            success: true,
            message: "All users retrieved successfully",
            data: {
                users,
                total: users.length
            }
        });
    } catch (error) {
        return handleError(res, error, "retrieving all users");
    }
}

export const getMylessons = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const user = await User.findById(userId).select('-password'); // Exclude password
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const groupId = await LessonGroup.find({members:userId})
        // Assuming lessons are stored in a separate collection and linked to users
        const lessons = await Lesson.find({ groupId }).sort('-scheduledAt'); // Sort by scheduled date
        
        return res.status(200).json({
            success: true,
            message: "User lessons retrieved successfully",
            data: lessons,
        });
    } catch (error) {
        return handleError(res, error, "retrieving user lessons");
    }
}


export const getMyReports = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }
        
        const reports = await LessonReport.find({ sudentId:userId })
            .sort('-createdAt')
            .populate('lessonId');
        
        return res.status(200).json({
            success: true,
            message: "User reports retrieved successfully",
            data: reports,
        });
    } catch (error) {
        return handleError(res, error, "retrieving user reports");
    }
}

export const getMyGroup = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }
        
        const group = await LessonGroup.findOne({ members: userId })
            .populate('teacherId', 'name email')
            .populate('members', 'name email')
            .populate('lessons');
        
        if (!group) {
            return res.status(404).json({
                success: false,
                message: "Group not found"
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "User group retrieved successfully",
            data: group,
        });
    } catch (error) {
        return handleError(res, error, "retrieving user group");
    }
}

export const updateCredits = async (req: Request, res: Response) => {
    try {
        const { privateAmount, publicAmount, userId } = req.body;


        // Input validation
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        // Convert to numbers and validate
        const privateCredits = Number(privateAmount);
        const publicCredits = Number(publicAmount);

        if (privateCredits < 0 || publicCredits < 0) {
            return res.status(400).json({
                success: false,
                message: "Credit amounts cannot be negative"
            });
        }

        if (privateCredits === 0 && publicCredits === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one credit amount must be provided"
            });
        }

        // Find and update user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Update credits
        user.PrivitelessonCredits += privateCredits;
        user.PubliclessonCredits += publicCredits;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Credits updated successfully",
            data: {
                userId: user._id,
                privateCredits: user.PrivitelessonCredits,
                publicCredits: user.PubliclessonCredits
            }
        });
    } catch (error) {
        return handleError(res, error, "updating credits");
    }
}




// => في داش بورد الطالب عايزين الحلقات المستحقة خلال الشهر و الحلقات المتبقية و الحلقات المكتملة و مرات الحضور مرات الغياب

export const getUserStats = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        // completed lessons inside the group that student is part of
        const userGroup = await LessonGroup.findOne({ members: userId });
        if (!userGroup) {
            return res.status(200).json({ 
                success: true,
                message: "User group not found",
                data: {
                    PrivitelessonCredits: user.PrivitelessonCredits,
                    PubliclessonCredits: user.PubliclessonCredits,
                },
            });
        }

        // get how many attended lessons from the reports
        // get the reports for the lessons in the group that the student is part of now
        const reports = await LessonReport.find({ sudentId: userId, lessonId: { $in: userGroup.lessons } }).populate('lessonId');
        const attendedLessons = reports.filter(report => report.attended === true).length;
        const missedLessons = reports.filter(report => report.attended === false).length;
        const completedLessons = reports.filter(report => report.completeLesson === true).length;

        return res.status(200).json({
            success: true,
            message: "User stats retrieved successfully",
            data: {
                completedLessons,
                attendedLessons,
                missedLessons,
                GroupReports: reports,
                GroupName: userGroup.name,
                GroupMeetingLink: userGroup.meetingLink,
                GroupUsualDate: userGroup.usualDate,
                typeOfGroup: userGroup.type,
                PrivitelessonCredits: user.PrivitelessonCredits,
                PubliclessonCredits: user.PubliclessonCredits,
            },
        });
    } catch (error) {
        return handleError(res, error, "retrieving user stats");
    }
}


// =>  مطلوب الحصة القادمة  مراجعة و جديد نوعهarray

export const wantedForNextLesson = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }


        // Find the last report of the last completed session
        const lessonGroup = await LessonGroup.findOne({ members: userId });
        if (!lessonGroup) {
            return res.status(404).json({ 
                success: false,
                message: "Lesson group not found" 
            });
        }
        
        const lastSession = await Lesson.findOne({ groupId: lessonGroup._id, status: 'completed' }).sort({ scheduledAt: -1 });

        // Try to find the report for the last completed session
        let lastReport = null;
        if (lastSession) {
            const lastSessionReport = await LessonReport.findOne({ 
                lessonId: lastSession._id, 
                sudentId: userId 
            });

            // If user attended the last session, use that report
            if (lastSessionReport && lastSessionReport.attended) {
                lastReport = lastSessionReport;
            } else {
                // If user didn't attend the last session or no report exists,
                // find the report from the last session they actually attended
                const allGroupLessons = await Lesson.find({ 
                    groupId: lessonGroup._id, 
                    status: 'completed' 
                }).sort({ scheduledAt: -1 }).select('_id');
                
                const lessonIds = allGroupLessons.map(lesson => lesson._id);
                
                lastReport = await LessonReport.findOne({ 
                    lessonId: { $in: lessonIds }, 
                    sudentId: userId,
                    attended: true // Only get reports where user attended
                }).sort({ createdAt: -1 });
            }
        }

        const nextLesson = await Lesson.findOne({ groupId: lessonGroup._id, status: 'scheduled' }).sort({ scheduledAt: 1 });

        return res.status(200).json({
            success: true,
            message: "Upcoming lesson retrieved successfully",
            nextLesson: nextLesson, 
            lastSession: lastSession,
            lastReport: lastReport,
            wantedForNextLesson: lastReport?.wantedForNextLesson,
            newMemorized: lastReport?.newMemorized,
        });
    } catch (error) {
        return handleError(res, error, "retrieving next lesson");
    }
}

