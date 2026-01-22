import express from 'express';
import {
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser,
    getAllCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    getDashboardStats
} from '../controllers/adminController.js';
import { uploadAndConvertCourse, saveApprovedCourse, upload } from '../controllers/adminCourseController.js';
import { protect, authorize } from '../middleware/auth.js';


const router = express.Router();

/**
 * Admin Routes
 * All routes require admin authentication
 */

// Apply admin authorization to all routes
router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/stats', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Course management
router.get('/courses', getAllCourses);
router.get('/courses/:id', getCourse);
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

// AI Conversion Routes
router.post('/courses/upload', upload, uploadAndConvertCourse);
router.post('/courses/save', saveApprovedCourse);

export default router;
