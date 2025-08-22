import { ObjectId } from "mongodb";
import { Schema, model } from "mongoose";

export interface ICourse extends Document {
  _id: ObjectId;
  title: string;
  description: string;
  telegramLink: string;
  startAt: Date;
  duration: string; // e.g., "4 weeks", "2 months", "3 hours"
  registrations: {
    userId?: ObjectId;
    userName: string;
    email: string;
    phone: string;
    age: number;
    country: string;
    city: string;
    registeredAt: Date;
  }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    telegramLink: { type: String, required: true },
    startAt: { type: Date, required: true },
    duration: { type: String, required: true },
    registrations: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        userName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        age: { type: Number, required: true, min: 0 },
        country: { type: String, required: true },
        city: { type: String, required: true },
        registeredAt: { type: Date, default: Date.now },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const Course = model<ICourse>("Course", courseSchema);
export default Course;
