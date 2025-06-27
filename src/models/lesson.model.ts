import { ObjectId } from 'mongodb';
import { Schema, model } from 'mongoose';

interface ILesson {
    _id: ObjectId;
    studentId: ObjectId[];
    teacherId: ObjectId;
    type: 'individual' | 'group';
    subject: string; 
    scheduledAt: Date;
    duration: number; 
    meetingLink: string;
    status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
    attendance: {
        studentPresent: boolean;
        teacherPresent: boolean;
    };
    report?: {
        progress: string;
        newMemorized: string;
        notes: string;
        rating: number;
        submittedAt: Date;
    };
    createdAt: Date;
    updatedAt: Date;
}

const lessonSchema = new Schema<ILesson>({
    studentId: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['individual', 'group'], required: true },
    subject: { type: String, required: true },
    scheduledAt: { type: Date, required: true },
    duration: { type: Number, required: true }, 
    meetingLink: { type: String, required: true },
    status: { type: String, enum: ['scheduled', 'completed', 'cancelled', 'no-show'], default: 'scheduled' },
    attendance: {
        studentPresent: { type: Boolean, default: false },
        teacherPresent: { type: Boolean, default: false }
    },
    report: {
        progress: { type: String, default: '' },
        newMemorized: { type: String, default: '' },
        notes: { type: String, default: '' },
        rating: { type: Number, min: 1, max: 5, default: 0 },
        submittedAt: { type: Date }
    }
}, {
    timestamps: true
});


const Lesson = model<ILesson>('Lesson', lessonSchema);
export { ILesson, Lesson };