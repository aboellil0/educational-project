import { Document, ObjectId } from 'mongoose';
import { Schema, model } from 'mongoose';


export interface Ireviews extends Document {
    _id: ObjectId;
    name: string;
    rating: { type: Number, min: 0, max: 5, required: false };
    txt: string;
    hide: Boolean;
    adminAccepted: Boolean;
    createdAt: Date;
}

const reviewsSchema = new Schema<Ireviews>({
    name: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5, required: false },
    txt: { type: String, required: true },
    hide: { type: Boolean, default: false },
    adminAccepted: { type: Boolean, default: false },
},{
    timestamps: true,
});

const Reviews = model<Ireviews>('Reviews', reviewsSchema);
export default Reviews;
