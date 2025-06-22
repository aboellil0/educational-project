export type UserRole = 'student' | 'parent' | 'teacher' | 'admin';
export type LessonType = 'individual' | 'group';
export type LessonStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';
export type AttendanceStatus = 'present' | 'absent' | 'late';
export type PaymentStatus = 'pending' | 'confirmed' | 'rejected';

export interface User {
    id: string;
    email: string;
    phone?: string;
    password_hash: string;
    name: string;
    role: UserRole;
    age?: number;
    quran_memorized?: string;
    is_verified: boolean;
    free_lesson_used: boolean;
    lesson_credits: number;
    refresh_token?: string;
    fcm_token?: string;
    last_login?: Date;
    created_at: Date;
    updated_at: Date;
}