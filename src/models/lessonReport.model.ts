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
    content: string; // Text content of the report
    newMemorized: string; // e.g., "Surah Al-Ikhlas"
    notes?: string; // Additional notes
    rating?: number; // Rating out of 5
    wantedForNextLesson?: string; // e.g., "Surah Al-Mulk"
    doneHomework?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const lessonReportSchema = new Schema<ILessonReport>({
    lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
    sudentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    attended: { type: Boolean, default: false }, // Indicates if the student attended the lesson
    content: { type: String, required: true },
    newMemorized: { type: String, required: true }, // e.g., "Surah Al-Ikhlas"
    wantedForNextLesson: { type: String, required: false }, // e.g., "Surah Al-Mulk"
    doneHomework: { type: Boolean, default: false }, // Indicates if the student completed the homework
    notes: { type: String, required: false },
    rating: { type: Number, min: 1, max: 5, required: false },
}, {
    timestamps: true
});

const LessonReport = model<ILessonReport>('LessonReport', lessonReportSchema);
export default LessonReport;