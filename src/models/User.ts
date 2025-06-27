import { ObjectId } from 'mongodb';
import { Schema, model } from 'mongoose';

interface IUser {
    _id: ObjectId;
    name: string;
    email: string;
    password: string; // hashed
    phone: string;
    role: 'admin' | 'teacher' | 'student' | 'parent';
    age?: number;
    quranMemorized: string;
    numOfPartsofQuran: number;
    isVerified: boolean;
    freeLessonUsed: boolean;
    lessonCredits: number;
    teacherProfile?: {
        specialization: string[];
        meetingLink: string;
        availability: object;
    };
    fcmToken?: string;
    createdAt: Date;
    updatedAt: Date;
}


const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ['admin', 'teacher', 'student', 'parent'], default: 'student' },
    age: { type: Number, min: 0 },
    quranMemorized: { type: String, default: '' },
    numOfPartsofQuran: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    freeLessonUsed: { type: Boolean, default: false },
    lessonCredits: { type: Number, default: 0 },
    teacherProfile: {
        specialization: [{ type: String }],
        meetingLink: { type: String },
        availability: { type: Object }
    },
    fcmToken: { type: String },
}, {
    timestamps: true
});

const User = model<IUser>('User', userSchema);
export { IUser, User };