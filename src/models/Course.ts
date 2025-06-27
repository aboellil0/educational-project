import { ObjectId } from 'mongodb';
import { Schema, model } from 'mongoose';

interface ICourse {
    _id: ObjectId;
    title: string;
    linkId: string; 
    description: string;
    telegramLink: string;
    registrations: {
      userId: ObjectId;
      registeredAt: Date;
    }[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}


const courseSchema = new Schema<ICourse>({
    title: { type: String, required: true },
    linkId: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    telegramLink: { type: String, required: true },
    registrations: [{
        userId: { type: ObjectId, ref: 'User', required: true },
        registeredAt: { type: Date, default: Date.now }
    }],
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

const Course = model<ICourse>('Course', courseSchema);
export { ICourse, Course };
