import { ObjectId } from 'mongodb';
import { Document,Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';


export interface IUser extends Document {
    _id: ObjectId;
    name: string;
    email: string;
    password: string; // hashed
    phone: string;
    role: 'admin' | 'teacher' | 'student' | 'parent';
    age?: number;
    quranMemorized: string;
    numOfPartsofQuran: number;
    isVerified: boolean;
    freeLessonUsed: boolean;
    lessonCredits: number;
    teacherProfile?: {
        specialization: string[];
        meetingLink: string;
        availability: object;
    };
    fcmToken?: string;
    googleId?: string;
    isEmailVerified?: boolean;
    emailVerificationToken?: string;
    emailVerificationExpires?: Date;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}


const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ['admin', 'teacher', 'student', 'parent'], default: 'student' },
    age: { type: Number, min: 0 },
    quranMemorized: { type: String, default: '' },
    numOfPartsofQuran: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    freeLessonUsed: { type: Boolean, default: false },
    lessonCredits: { type: Number, default: 0 },
    teacherProfile: {
        specialization: [{ type: String }],
        meetingLink: { type: String },
        availability: { type: Object }
    },
    fcmToken: { type: String },
    googleId: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    emailVerificationExpires: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
}, {
    timestamps: true
});



// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};


const User = model<IUser>('User', userSchema);
export default User;
