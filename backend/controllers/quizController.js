import Quiz from '../models/Quiz.js';
import UserQuizAttempt from '../models/UserQuizAttempt.js';
import Course from '../models/Course.js';
import { protect } from '../middleware/auth.js';

/**
 * @desc    Create a new quiz
 * @route   POST /api/quizzes
 * @access  Private (Instructor, Admin)
 */
export const createQuiz = async (req, res, next) => {
    try {
        const quizData = {
            ...req.body,
            createdBy: req.user._id
        };

        const quiz = await Quiz.create(quizData);
        await quiz.populate('courseId', 'title');
        await quiz.populate('createdBy', 'name email');

        res.status(201).json({
            success: true,
            message: 'Quiz created successfully',
            data: quiz
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all quizzes
 * @route   GET /api/quizzes
 * @access  Private
 */
export const getAllQuizzes = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, courseId, isPublished } = req.query;
        
        const query = {};
        if (courseId) query.courseId = courseId;
        if (isPublished !== undefined) query.isPublished = isPublished === 'true';

        const quizzes = await Quiz.find(query)
            .populate('courseId', 'title thumbnail')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Quiz.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                quizzes,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get quiz by ID
 * @route   GET /api/quizzes/:id
 * @access  Private
 */
export const getQuizById = async (req, res, next) => {
    try {
        const quiz = await Quiz.findById(req.params.id)
            .populate('courseId', 'title thumbnail')
            .populate('createdBy', 'name email');

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });
        }

        // Don't show correct answers to students
        if (req.user.role === 'student' && quiz.isPublished) {
            const quizForStudent = {
                ...quiz.toObject(),
                questions: quiz.questions.map(q => ({
                    ...q.toObject(),
                    options: q.options.map(opt => ({
                        text: opt.text,
                        explanation: opt.explanation
                    })),
                    correctAnswer: undefined
                }))
            };
            return res.status(200).json({
                success: true,
                data: quizForStudent
            });
        }

        res.status(200).json({
            success: true,
            data: quiz
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update quiz
 * @route   PUT /api/quizzes/:id
 * @access  Private (Quiz creator, Admin)
 */
export const updateQuiz = async (req, res, next) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });
        }

        // Check if user is authorized to update
        if (quiz.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this quiz'
            });
        }

        const updatedQuiz = await Quiz.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('courseId', 'title');

        res.status(200).json({
            success: true,
            message: 'Quiz updated successfully',
            data: updatedQuiz
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete quiz
 * @route   DELETE /api/quizzes/:id
 * @access  Private (Quiz creator, Admin)
 */
export const deleteQuiz = async (req, res, next) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });
        }

        // Check if user is authorized to delete
        if (quiz.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this quiz'
            });
        }

        await quiz.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Quiz deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Submit quiz attempt
 * @route   POST /api/quizzes/:id/attempt
 * @access  Private
 */
export const submitQuizAttempt = async (req, res, next) => {
    try {
        const { answers, timeSpent } = req.body;
        const quizId = req.params.id;

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });
        }

        if (!quiz.isPublished) {
            return res.status(400).json({
                success: false,
                message: 'Quiz is not published'
            });
        }

        // Check if user has attempts remaining
        const attemptCount = await UserQuizAttempt.countDocuments({
            userId: req.user._id,
            quizId: quizId
        });

        if (attemptCount >= quiz.maxAttempts) {
            return res.status(400).json({
                success: false,
                message: 'Maximum attempts reached for this quiz'
            });
        }

        // Calculate score
        let totalPoints = 0;
        let earnedPoints = 0;
        const processedAnswers = [];

        answers.forEach((answer, index) => {
            const question = quiz.questions[index];
            if (!question) return;

            totalPoints += question.points;
            let isCorrect = false;
            let pointsEarned = 0;

            if (question.type === 'multiple-choice') {
                const correctOption = question.options.find(opt => opt.isCorrect);
                isCorrect = answer === correctOption?.text;
            } else {
                isCorrect = answer === question.correctAnswer;
            }

            if (isCorrect) {
                pointsEarned = question.points;
                earnedPoints += pointsEarned;
            }

            processedAnswers.push({
                questionIndex: index,
                userAnswer: answer,
                isCorrect,
                pointsEarned,
                timeSpent: timeSpent?.[index] || 0
            });
        });

        const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
        const passed = score >= quiz.passingScore;

        // Create attempt record
        const attempt = await UserQuizAttempt.create({
            userId: req.user._id,
            quizId: quizId,
            attemptNumber: attemptCount + 1,
            answers: processedAnswers,
            score,
            totalPoints: earnedPoints,
            passed,
            timeStarted: new Date(Date.now() - (timeSpent?.total || 0) * 1000),
            timeCompleted: new Date(),
            duration: timeSpent?.total || 0
        });

        // Generate feedback (AI-style)
        const feedback = generateQuizFeedback(score, passed, processedAnswers, quiz);

        res.status(201).json({
            success: true,
            message: 'Quiz submitted successfully',
            data: {
                attempt,
                feedback,
                score,
                passed,
                attemptNumber: attempt.attemptNumber
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get user's quiz attempts
 * @route   GET /api/quizzes/:id/attempts
 * @access  Private
 */
export const getQuizAttempts = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const attempts = await UserQuizAttempt.find({
            userId: req.user._id,
            quizId: req.params.id
        })
        .populate('quizId', 'title')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

        const total = await UserQuizAttempt.countDocuments({
            userId: req.user._id,
            quizId: req.params.id
        });

        res.status(200).json({
            success: true,
            data: {
                attempts,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// Helper function to generate AI-style feedback
const generateQuizFeedback = (score, passed, answers, quiz) => {
    const feedback = {
        overall: passed ? 'Great job!' : 'Keep practicing!',
        score: `${score}%`,
        improvements: [],
        strengths: []
    };

    // Analyze incorrect answers
    const incorrectAnswers = answers.filter(a => !a.isCorrect);
    if (incorrectAnswers.length > 0) {
        feedback.improvements.push(`Focus on ${incorrectAnswers.length} concept${incorrectAnswers.length > 1 ? 's' : ''} you struggled with`);
    }

    // Analyze correct answers
    const correctAnswers = answers.filter(a => a.isCorrect);
    if (correctAnswers.length > 0) {
        feedback.strengths.push(`You demonstrated strong knowledge in ${correctAnswers.length} area${correctAnswers.length > 1 ? 's' : ''}`);
    }

    if (score >= 90) {
        feedback.overall = 'Excellent work! You have mastered this material.';
    } else if (score >= 70) {
        feedback.overall = 'Good job! You have a solid understanding.';
    } else if (score >= 50) {
        feedback.overall = 'You\'re on the right track. Review the material and try again.';
    }

    return feedback;
};

export default {
    createQuiz,
    getAllQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz,
    submitQuizAttempt,
    getQuizAttempts
};