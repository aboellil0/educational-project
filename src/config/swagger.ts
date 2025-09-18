import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Quran Memorization & Islamic Education Platform API',
      version: '1.0.0',
      description: 'A comprehensive API for managing Quran memorization courses, lessons, teachers, and students.',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001/api',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            age: { type: 'number' },
            country: { type: 'string' },
            city: { type: 'string' },
            role: { type: 'string', enum: ['student', 'teacher', 'admin'] },
            isVerified: { type: 'boolean' },
            quranMemorized: { type: 'string' },
            numOfPartsofQuran: { type: 'number' },
            freeLessonUsed: { type: 'boolean' },
            PrivitelessonCredits: { type: 'number' },
            PubliclessonCredits: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Teacher: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            specialization: { type: 'string' },
            experience: { type: 'number' },
            numberOflessonsCridets: { type: 'number' },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Course: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            duration: { type: 'number' },
            level: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'] },
            isActive: { type: 'boolean' },
            maxStudents: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Group: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            teacher: { type: 'string' },
            members: { type: 'array', items: { type: 'string' } },
            course: { type: 'string' },
            maxMembers: { type: 'number' },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Lesson: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            group: { type: 'string' },
            teacher: { type: 'string' },
            students: { type: 'array', items: { type: 'string' } },
            scheduledAt: { type: 'string', format: 'date-time' },
            duration: { type: 'number' },
            status: { type: 'string', enum: ['scheduled', 'ongoing', 'completed', 'cancelled'] },
            homework: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        LessonReport: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            lesson: { type: 'string' },
            student: { type: 'string' },
            teacher: { type: 'string' },
            attendance: { type: 'boolean' },
            performance: { type: 'string' },
            notes: { type: 'string' },
            homeworkStatus: { type: 'string', enum: ['not_assigned', 'assigned', 'completed'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Review: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            rating: { type: 'number', minimum: 1, maximum: 5 },
            comment: { type: 'string' },
            isApproved: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        ContactInfo: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            address: { type: 'string' },
            whatsappNumber: { type: 'string' },
            telegramLink: { type: 'string' },
            facebook: { type: 'string' },
            linkedin: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            error: { type: 'object' },
          },
        },
        Success: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Quran Platform API Documentation',
  }));
};

export default specs;