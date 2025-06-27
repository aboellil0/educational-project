import { ObjectId } from 'mongodb';
import { Schema, model } from 'mongoose';

interface INotification {
    _id: ObjectId;
    userId: ObjectId;
    title: string;
    message: string;
    type: 'lesson_reminder' | 'payment_confirmed' | 'exam_assigned' | 'account_verified';
    isRead: boolean;
    sentVia: ('push' | 'email')[];
    metadata?: object;
    createdAt: Date;
}



const notificationSchema = new Schema<INotification>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { 
        type: String, 
        enum: ['lesson_reminder', 'payment_confirmed', 'exam_assigned', 'account_verified'], 
        required: true 
    },
    isRead: { type: Boolean, default: false },
    sentVia: { type: [String], enum: ['push', 'email'], required: true },
    metadata: { type: Object },
}, {
    timestamps: true
});

const Notification = model<INotification>('Notification', notificationSchema);
export { INotification, Notification };