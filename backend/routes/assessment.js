import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  takeAssessment,
  getAssessmentResults,
  getAssessmentHistory
} from '../controllers/assessmentController.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   POST /api/assessments/:courseId/take
// @desc    Take course assessment
// @access  Private (Student only)
router.post('/:courseId/take', takeAssessment);

// @route   GET /api/assessments/:courseId/results/:attemptId
// @desc    Get assessment results and feedback
// @access  Private
router.get('/:courseId/results/:attemptId', getAssessmentResults);

// @route   GET /api/assessments/:courseId/history
// @desc    Get user's assessment history for a course
// @access  Private
router.get('/:courseId/history', getAssessmentHistory);

export default router;