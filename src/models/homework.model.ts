import { ObjectId } from 'mongodb';
import mongoose, { Document,Schema,Model } from 'mongoose';


export interface IHomework extends Document {
    _id: ObjectId;
    lessonId: ObjectId;
    teacherId: ObjectId;
    title: string;
    description: string;
    instructions: string;
    attachments?: string[]; // URLs to files
    dueDate: Date;
    assignedTo: ObjectId[]; // User IDs who received this homework
    submissions: {
        userId: ObjectId;
        submittedAt: Date;
        content: string;
        attachments?: string[];
        status: 'submitted' | 'late' | 'pending';
    }[];
    grading: {
        userId: ObjectId;
        grade: number; // out of 100
        feedback: string;
        gradedBy: ObjectId; // Teacher ID
        gradedAt: Date;
    }[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const homeworkSchema = new Schema<IHomework>({
    lessonId: { type: Schema.Types.ObjectId, required: true, ref: 'Lesson' },
    teacherId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructions: { type: String, required: true },
    attachments: [{ type: String }], // URLs to files
    dueDate: { type: Date, required: true },
    assignedTo: [{ type: Schema.Types.ObjectId, ref: 'User' }], // User IDs who received this homework
    submissions: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        submittedAt: { type: Date, default: Date.now },
        content: { type: String, required: true },
        attachments: [{ type: String }],
        status: { type: String, enum: ['submitted', 'late', 'pending'], default: 'pending' }
    }],
    grading: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        grade: { type: Number, min: 0, max: 100 }, // out of 100
        feedback: { type: String },
        gradedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Teacher ID
        gradedAt: { type: Date }
    }],
    isActive:{type:Boolean,default:true},
    createdAt:{type : Date ,default : Date.now},
    updatedAt:{type : Date ,default : Date.now}
});


const Homework: Model<IHomework> = mongoose.model<IHomework>('Homework', homeworkSchema);
export default Homework;
