// - id (PK)
// - lessonId (FK → Lesson)
// - teacherId (FK → Teacher)
// - content (text)
// - memorizedAmount (e.g., "Surah Al-Mulk")

import { Document, ObjectId } from 'mongoose';
import { Schema, model } from 'mongoose';

export interface ILessonReport extends Document {
    _id: ObjectId;
    lessonId: ObjectId; 
    sudentId: ObjectId; 
    attended: boolean; // Indicates if the student attended the lesson
    completeLesson?: boolean; // Indicates if the lesson was completed
    content: string; // Text content of the report
    newMemorized: {
        new: string[]; 
        old: string[]; 
    }; // e.g., "Surah Al-Ikhlas"
    notes?: string; // Additional notes
    rating?: number; // Rating out of 5
    wantedForNextLesson: {
        new: string[]; 
        old: string[]; 
    }; 
    doneHomework?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const lessonReportSchema = new Schema<ILessonReport>({
    lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
    sudentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    attended: { type: Boolean, default: false }, // Indicates if the student attended the lesson
    content: { type: String, required: true },
    completeLesson: { type: Boolean, default: false },
    newMemorized: {
        new: [{ type: String }],
        old: [{ type: String }]
    },
    wantedForNextLesson: {
        new: [{ type: String }],
        old: [{ type: String }]
    },
    doneHomework: { type: Boolean, default: false }, // Indicates if the student completed the homework
    notes: { type: String, required: false },
    rating: { type: Number, min: 1, max: 5, required: false },
}, {
    timestamps: true
});

const LessonReport = model<ILessonReport>('LessonReport', lessonReportSchema);
export default LessonReport;