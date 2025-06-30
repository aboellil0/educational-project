import { required, string } from 'joi';
import { Document, ObjectId } from 'mongoose';
import { Schema, model } from 'mongoose';

export interface IContactInfo extends Document {
    _id: ObjectId;
    whatsappNumber: string[];
    phone: string[];
    facebook?:string;
    linkedin?:string;
    telegramLink?: string;
    email?: string;
    address?: string;
    isActive: boolean;
    updatedBy: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const contactInfoSchema = new Schema<IContactInfo>({
    whatsappNumber: [{ type: String, required: true }],
    phone: [{type:string,required:true}],
    facebook: {type:string},
    linkedin: {type:string},
    address: {type:string},
    telegramLink: { type: String, default: '' },
    email: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true,
});

const ContactInfo = model<IContactInfo>('ContactInfo', contactInfoSchema);
export default ContactInfo;