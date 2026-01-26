import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getCourseAssessment,
  removeCourseAssessment,
  updateCourseAssessment
} from '../controllers/courseAssessmentController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/courses/:courseId/assessment
// @desc    Get course assessment details
// @access  Private (Instructor/Admin only)
router.get('/:courseId/assessment', 
  authorize('instructor', 'admin'), 
  getCourseAssessment
);

// @route   DELETE /api/courses/:courseId/assessment
// @desc    Remove assessment from course
// @access  Private (Instructor/Admin only)
router.delete('/:courseId/assessment', 
  authorize('instructor', 'admin'), 
  removeCourseAssessment
);

// @route   PUT /api/courses/:courseId/assessment
// @desc    Update course assessment settings
// @access  Private (Instructor/Admin only)
router.put('/:courseId/assessment', 
  authorize('instructor', 'admin'), 
  updateCourseAssessment
);

export default router;