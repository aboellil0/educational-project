import { ObjectId } from 'mongodb';
import { Document, Schema, model } from 'mongoose';

export interface ILesson extends Document {
  _id: ObjectId;
  groupId: ObjectId;
  reportId?: ObjectId[]; // Optional reference to a lesson report
  subject: string;
  scheduledAt: Date;
  meetingLink: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  homework?: {
    _id: ObjectId;
    title: string;
    description: string;
  };
  createdAt: Date;
  updatedAt: Date
}

const lessonSchema = new Schema<ILesson>({
  groupId: { type: Schema.Types.ObjectId, ref: 'LessonGroup', required: true },
  reportId: [{ type: Schema.Types.ObjectId, ref: 'LessonReport' }], // Optional reference to a lesson report
  subject: { type: String, required: true }, // e.g., "Surah Al-Fatiha", "Juz 1"
  scheduledAt: { type: Date, required: true },
  meetingLink: { type: String, required: true },
  homework: {
    _id: { type: Schema.Types.ObjectId, ref: 'Homework' },
    title: { type: String },
    description: { type: String }
  },
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
    default: 'scheduled'
  }
}, {
  timestamps: true
});

const Lesson = model<ILesson>('Lesson', lessonSchema);
export default Lesson;