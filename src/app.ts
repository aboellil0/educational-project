import express, { Application } from 'express';
import cors from 'cors';
import teacherRoutes from './routes/teacher.routes';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/teachers', teacherRoutes);

export default app;