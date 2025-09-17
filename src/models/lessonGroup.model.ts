import { Document, ObjectId } from 'mongoose';
import { Schema, model } from 'mongoose';

export interface ILessonGroup extends Document {
    _id: ObjectId;
    name: string;
    description?: string;
    type: 'private' | 'public';
    teacherId: ObjectId;
    members: ObjectId[];
    lessons: ObjectId[];
    meetingLink: string;
    usualDate: {
        firstDay: string;
        firstDayTime?: string;
        secondDay?: string;
        secondDayTime?: string;
        thirdDay?: string;
        thirdDayTime?: string;
        fourthDay?: string;
        fourthDayTime?: string;
        fifthDay?: string;
        fifthDayTime?: string;
        sixthDay?: string;
        sixthDayTime?: string;
        seventhDay?: string;
        seventhDayTime?: string;
    };
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const lessonGroupSchema = new Schema<ILessonGroup>({
    name: { type: String, required: true },
    description: { type: String, required: false },
    type: { type: String, enum: ['private', 'public'], required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    lessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
    meetingLink: { type: String, required: true },
    usualDate: {
        firstDay: { type: String, required: true },
        firstDayTime: { type: String },
        secondDay: { type: String },
        secondDayTime: { type: String },
        thirdDay: { type: String },
        thirdDayTime: { type: String },
    },
    isActive: { type: Boolean, default: true  },
}, {
    timestamps: true
});

const LessonGroup = model<ILessonGroup>('LessonGroup', lessonGroupSchema);
export default LessonGroup;