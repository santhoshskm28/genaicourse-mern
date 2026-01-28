import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getAssessmentForCourse,
  takeAssessment,
  getAssessmentResults,
  getAssessmentHistory
} from '../controllers/assessmentController.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   GET /api/assessments/:courseId/quiz
// @desc    Get assessment for taking
// @access  Private (Student)
router.get('/:courseId/quiz', getAssessmentForCourse);

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

// @route   GET /api/assessments/:courseId/progress-check
// @desc    Check if user can take assessment (debug endpoint)
// @access  Private
router.get('/:courseId/progress-check', async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const userProgress = await UserProgress.findOne({ userId, courseId });
    if (!userProgress) {
      return res.status(403).json({ success: false, message: 'Not enrolled in course' });
    }

    const completedLessonsCount = userProgress.completedLessons ? userProgress.completedLessons.length : 0;
    const totalLessonsCount = course.modules ? course.modules.reduce((acc, module) => acc + (module.lessons ? module.lessons.length : 0), 0) : 0;

    res.json({
      success: true,
      data: {
        courseId,
        completedLessons: completedLessonsCount,
        totalLessons: totalLessonsCount,
        canTakeAssessment: completedLessonsCount >= totalLessonsCount,
        progressPercentage: Math.round((completedLessonsCount / totalLessonsCount) * 100)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;