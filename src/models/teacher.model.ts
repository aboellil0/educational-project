import { ObjectId } from "mongodb";
import { Schema, model,Document } from "mongoose";

export interface ITeacher extends Document {
    _id: ObjectId;
    userId: ObjectId; // Reference to the User model
    specialization: string[];
    meetingLink: string;
    numberOflessonsCridets: number;
    availability: object;
}

const teacherSchema = new Schema<ITeacher>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    specialization: [{ type: String, required: true }],
    meetingLink: { type: String, required: true },
    numberOflessonsCridets: { type: Number, default: 0 },
    availability: { type: Object, required: true },
}, {
    timestamps: true,
});

const Teacher = model<ITeacher>('Teacher', teacherSchema);
export default Teacher;
