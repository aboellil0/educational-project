import { ObjectId } from 'mongodb';
import { Document,Schema, model } from 'mongoose';

export interface ILesson extends Document {
    _id: ObjectId;
    userId: ObjectId; // The user who booked the lesson
    teacherId: ObjectId; // Assigned by admin
    type: 'private' | 'public'; // Private (1-on-1) or Public (group)
    subject: string; // "Surah Al-Fatiha", "Juz 1", etc.
    scheduledAt: Date;
    duration: number; // minutes
    meetingLink: string;
    maxParticipants?: number; // For public lessons only
    currentParticipants: ObjectId[]; // Array of user IDs (for public lessons)
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
    attendance: {
      userId: ObjectId;
      present: boolean;
      joinedAt?: Date;
      leftAt?: Date;
    }[];
    report?: {
      progress: string;
      newMemorized: string;
      notes: string;
      rating: number;
      submittedAt: Date;
      submittedBy: ObjectId; // Teacher ID
    };
    homework?: {
      _id: ObjectId;
      title: string;
      description: string;
      dueDate: Date;
      assignedAt: Date;
      submissions: {
        userId: ObjectId;
        submittedAt: Date;
        content: string;
        attachments?: string[];
        grade?: number;
        feedback?: string;
        gradedBy?: ObjectId;
        gradedAt?: Date;
      }[];
    };
    assignedBy: ObjectId; // Admin who assigned the teacher
    createdAt: Date;
    updatedAt: Date
}

const lessonSchema = new Schema<ILesson>({
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' }, // The user who booked the lesson
    teacherId: { type: Schema.Types.ObjectId, required: true, ref: 'User' }, // Assigned by admin
    type: { type: String, enum: ['private', 'public'], required: true },
    subject: { type: String, required: true },
    scheduledAt: { type: Date, required: true },
    duration: { type: Number, required: true }, // in minutes
    meetingLink: { type: String, required: true },
    maxParticipants: { type: Number }, // For public lessons only
    currentParticipants: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs (for public lessons)
    status: {
        type: String,
        enum: ['scheduled', 'in_progress', 'completed', 'cancelled', 'no_show'],
        default: 'scheduled'
    },
    attendance: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        present: { type: Boolean, default: false },
        joinedAt: Date,
        leftAt: Date
    }],
    report: {
        progress: String,
        newMemorized: String,
        notes: String,
        rating: { type: Number, min: 1, max: 5 },
        submittedAt: Date,
        submittedBy: { type: Schema.Types.ObjectId, ref:'User' } // Teacher ID
    },
    homework:{
      _id:{type:ObjectId},
      title:{type:String},
      description:{type:String},
      dueDate:{type:String},
      assignedAt:{type:String},
      submissions:[{
          userId:{type:ObjectId},
          submittedAt:{type:String},
          content:{type:String},
          attachments:[{type:String}],
          grade:{type:Number},
          feedback:{type:String},
          gradedBy:{type:ObjectId},
          gradedAt:{type:String}
      }]
  },
    assignedBy:{ type : Schema.Types.ObjectId , ref : 'User' }, // Admin who assigned the teacher
}, {
    timestamps: true
});


const Lesson = model<ILesson>('Lesson', lessonSchema);
export default Lesson;