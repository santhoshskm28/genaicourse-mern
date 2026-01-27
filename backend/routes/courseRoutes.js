import express from 'express';
import {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    enrollCourse,
    getCourseProgress,
    updateCourseProgress,
    addReview,
    getEnrolledCourses,
    addBookmark,
    getBookmarks,
    addNote,
    getNotes,
    getCourseAnalytics
} from '../controllers/courseController.js';
import { protect, authorize } from '../middleware/auth.js';
import { courseValidation, validate } from '../middleware/validation.js';

const router = express.Router();

/**
 * Course Routes
 */

// Public routes
router.get('/', getCourses);
// /enrolled must be before /:id so "enrolled" is not matched as course id
router.get('/enrolled', protect, getEnrolledCourses);
router.get('/:id', getCourse);

// Protected routes (User)
router.post('/:id/enroll', protect, enrollCourse);
router.get('/:id/progress', protect, getCourseProgress);
router.put('/:id/progress', protect, updateCourseProgress);

// Protected routes (User)
router.post('/:id/reviews', protect, addReview);
router.post('/:id/bookmarks', protect, addBookmark);
router.get('/:id/bookmarks', protect, getBookmarks);
router.post('/:id/notes', protect, addNote);
router.get('/:id/notes', protect, getNotes);
router.get('/:id/analytics', protect, authorize('instructor', 'admin'), getCourseAnalytics);

// Admin/Instructor routes
router.post('/', protect, authorize('instructor', 'admin'), courseValidation, validate, createCourse);
router.put('/:id', protect, authorize('instructor', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('admin'), deleteCourse);

export default router;
