import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import connectDB from './config/database.js';
import errorHandler from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import learningPathRoutes from './routes/learningPathRoutes.js';
import assessmentRoutes from './routes/assessment.js';
import assessmentUploadRoutes from './routes/assessmentUpload.js';
import courseAssessmentRoutes from './routes/courseAssessment.js';
import passport from 'passport';
import configurePassport from './config/passport.js';

// Console log to verify env variables are loaded (debug)
console.log('✅ Auth Variables Check:', {
    google: !!process.env.GOOGLE_CLIENT_ID,
    github: !!process.env.GITHUB_CLIENT_ID,
    linkedin: !!process.env.LINKEDIN_CLIENT_ID
});

// Initialize express app
const app = express();

const startServer = async () => {

    // Connect to database
    await connectDB();

    // CORS configuration - Allow localhost with any port for development
    const corsOptions = {
        origin: [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:3002',
            'http://localhost:3003',
            'http://localhost:3004',
            'http://localhost:3005',
            'http://localhost:5173'
        ],
        credentials: true,
        optionsSuccessStatus: 200
    };
    app.use(cors(corsOptions));

    // Security middleware
    app.use(helmet());

    // Passport initialization
    configurePassport();
    app.use(passport.initialize());

    // Rate limiting
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 1000, // Increased limit for development
        message: 'Too many requests from this IP, please try again later.'
    });
    app.use('/api/', limiter);

    // Body parser middleware
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Logging middleware
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }

    // Root route - Welcome message
    app.get('/', (req, res) => {
        res.status(200).json({
            success: true,
            message: 'Welcome to GenAI Course Platform API',
            version: '1.0.0',
            endpoints: {
                health: '/health',
                auth: '/api/auth',
                courses: '/api/courses',
                admin: '/api/admin',
                quizzes: '/api/quizzes',
                certificates: '/api/certificates',
                learningPaths: '/api/learning-paths',
                assessments: '/api/assessments',
                courseAssessments: '/api/courses/:courseId/assessment'
            },
            documentation: 'Visit /health for server status'
        });
    });

    // Health check route
    app.get('/health', (req, res) => {
        res.status(200).json({
            success: true,
            message: 'Server is running',
            timestamp: new Date().toISOString(),
            database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
            environment: process.env.NODE_ENV || 'development'
        });
    });

    // API routes
    app.use('/api/auth', authRoutes);
    app.use('/api/courses', courseRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/quizzes', quizRoutes);
    app.use('/api/certificates', certificateRoutes);
    app.use('/api/learning-paths', learningPathRoutes);
    app.use('/api/assessments', assessmentRoutes); // Student assessment routes (take quiz, etc.)
    app.use('/api/assessments', assessmentUploadRoutes); // Upload/management routes after
    app.use('/api/courses', courseAssessmentRoutes);

    // 404 handler
    app.use('*', (req, res) => {
        res.status(404).json({
            success: false,
            message: `Route ${req.originalUrl} not found`
        });
    });

    // Error handler middleware (must be last)
    app.use(errorHandler);

    // Start server
    const PORT = process.env.PORT || 5000;

    try {
        const server = app.listen(PORT, () => {
            console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 GenAI Course Platform - Backend Server              ║
║                                                           ║
║   Environment: ${process.env.NODE_ENV || 'development'}                                  ║
║   Port: ${PORT}                                              ║
║   URL: http://localhost:${PORT}                             ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
      `);
            console.log('Server is listening on port', PORT);
        });

        server.on('error', (err) => {
            console.error('Server error:', err);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1); // Added process.exit(1) here
    }

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
        console.error(`❌ Unhandled Rejection: ${err.message}`);
        server.close(() => process.exit(1));
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
        console.error(`❌ Uncaught Exception: ${err.message}`);
        process.exit(1);
    });

};

startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});

export default app;
