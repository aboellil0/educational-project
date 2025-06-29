import { Document, ObjectId } from 'mongoose';
import { Schema, model } from 'mongoose';

export interface ILessonGroup extends Document {
    _id: ObjectId;
    name: string;
    description: string;
    type: 'private' | 'public';
    teacherId: ObjectId;
    members: ObjectId[];
    lessons: ObjectId[];
    meetingLink: string;
    usualDate: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const lessonGroupSchema = new Schema<ILessonGroup>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['private', 'public'], required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    lessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
    meetingLink: { type: String, required: true },
    isActive: { type: Boolean, default: true  },
}, {
    timestamps: true
});

const LessonGroup = model<ILessonGroup>('LessonGroup', lessonGroupSchema);
export default LessonGroup;