import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import compression from 'compression';
import cookieParser from 'cookie-parser';

// Routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import adminRoutes from './routes/admin.routes';
import groupRoutes from './routes/group.routes';
import lessonRoutes from './routes/lesson.routes';
import reportRoutes from './routes/report.routes';
import teacherRoutes from './routes/teacher.routes';
import courseRoutes from './routes/course.routes';



import path from 'path';
import { config } from './config/enviroment';
import adminRouter from './routes/admin.routes';

const server = async (): Promise<void> => {

  // Initialize environment variables
  dotenv.config();

  // Create Express app
  const app = express();

  // Apply middlewares
  app.use(helmet()); // Security headers
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(morgan('dev')); // Logging

  // Serve static files for testing frontend
  app.use(express.static(path.join(__dirname, '../public')));

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/teacher',teacherRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/admin',adminRoutes);
  app.use('/api/group', groupRoutes);
  app.use('/api/lesson', lessonRoutes);
  app.use('/api/report',reportRoutes);
  app.use('/api/course', courseRoutes);


  // Error handler middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  });

  // Start server
  const PORT = config.port;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default server;
