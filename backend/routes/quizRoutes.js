import express from 'express';
import {
    createQuiz,
    getAllQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz,
    submitQuizAttempt,
    getQuizAttempts
} from '../controllers/quizController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * Quiz Routes
 */

// Create quiz (instructors and admins only)
router.post('/', protect, authorize('instructor', 'admin'), createQuiz);

// Get all quizzes
router.get('/', protect, getAllQuizzes);

// Get quiz by ID
router.get('/:id', protect, getQuizById);

// Update quiz
router.put('/:id', protect, updateQuiz);

// Delete quiz
router.delete('/:id', protect, deleteQuiz);

// Submit quiz attempt
router.post('/:id/attempt', protect, submitQuizAttempt);

// Get quiz attempts for user
router.get('/:id/attempts', protect, getQuizAttempts);

export default router;