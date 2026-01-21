import express from 'express';
import {
    generateLearningPath,
    getUserLearningPaths,
    getLearningPathById,
    updateProgress,
    getCourseRecommendations
} from '../controllers/learningPathController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * Learning Path Routes
 */

// Generate personalized learning path
router.post('/generate', protect, generateLearningPath);

// Get user learning paths
router.get('/', protect, getUserLearningPaths);

// Get learning path by ID
router.get('/:id', protect, getLearningPathById);

// Update learning path progress
router.put('/:id/update-progress', protect, updateProgress);

// Get AI course recommendations
router.get('/recommendations', protect, getCourseRecommendations);

export default router;