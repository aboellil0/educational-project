import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User,{ IUser } from '../models/user.model';
import dotenv from 'dotenv';
import { config } from '../config/enviroment';

dotenv.config();

const JWT_SECRET = config.jwtSecret;


interface TokenPayload {
    userId: string;
    role: 'admin' | 'teacher' | 'student' | 'parent';
    isVerified: boolean;
    iat: number;
    tokenVersion?: number;
}
export const generateAccessToken = (user: IUser): string => {
    const payload: TokenPayload = {
        userId: user._id.toString(),
        role: user.role,
        isVerified: user.isVerified,
        iat: Math.floor(Date.now() / 1000),
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (user: IUser, tokenVersion = 0): string => {
    const payload: TokenPayload = {
        userId: user._id.toString(),
        role: user.role,
        isVerified: user.isVerified,
        iat: Math.floor(Date.now() / 1000),
        tokenVersion
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): TokenPayload => {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

export const generateVerificationToken = (): string => {
    return crypto.randomBytes(32).toString('hex');
};

export const generateVerificationCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};