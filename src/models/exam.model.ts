import { ObjectId } from 'mongodb';
import { Schema, model } from 'mongoose';

interface IExam {
    _id: ObjectId;
    title: string;
    subject: string;
    teacherId: ObjectId;
    studentIds: ObjectId[];
    questions: {
        question: string;
        options: string[];
        correctAnswer: number;
        points: number;
    }[];
    duration: number; // minutes
    startTime: Date;
    endTime: Date;
    results: {
        studentId: ObjectId;
        answers: number[];
        score: number;
        completedAt: Date;
    }[];
    createdAt: Date;
}


const examSchema = new Schema<IExam>({
    title: { type: String, required: true },
    subject: { type: String, required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    studentIds: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    questions: [{
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswer: { type: Number, required: true },
        points: { type: Number, required: true }
    }],
    duration: { type: Number, required: true }, // in minutes
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    results: [{
        studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        answers: [{ type: Number, required: true }],
        score: { type: Number, default: 0 },
        completedAt: { type: Date }
    }]
}, {
    timestamps: true
});


const Exam = model<IExam>('Exam', examSchema);
export { IExam, Exam };