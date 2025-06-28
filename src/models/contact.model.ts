import { Document, ObjectId } from 'mongoose';
import { Schema, model } from 'mongoose';

export interface IContactInfo extends Document {
    _id: ObjectId;
    type: 'admin_contact';
    whatsappNumber: string;
    telegramLink?: string;
    email?: string;
    contactHours: string;
    welcomeMessage: string;
    isActive: boolean;
    updatedBy: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const contactInfoSchema = new Schema<IContactInfo>({
    type: { type: String, default: 'admin_contact', required: true },
    whatsappNumber: { type: String, required: true },
    telegramLink: { type: String, default: '' },
    email: { type: String, default: '' },
    contactHours: { type: String, required: true },
    welcomeMessage: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true,
});

const ContactInfo = model<IContactInfo>('ContactInfo', contactInfoSchema);
export default ContactInfo;