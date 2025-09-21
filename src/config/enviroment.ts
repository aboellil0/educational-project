// config/environment.ts
export const config = {
    port: process.env.PORT || 3001,
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/quran-platform',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    firebaseConfig: {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    }
};