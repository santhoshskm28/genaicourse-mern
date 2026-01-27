import mongoose from 'mongoose';

/**
 * User Quiz Attempt Schema
 * Tracks user quiz attempts and scores
 */
const userQuizAttemptSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    attemptNumber: {
        type: Number,
        required: true,
        min: 1
    },
    answers: [{
        questionIndex: {
            type: Number,
            required: true
        },
        userAnswer: mongoose.Schema.Types.Mixed, // String, Array, or Object depending on question type
        isCorrect: {
            type: Boolean,
            required: true
        },
        pointsEarned: {
            type: Number,
            required: true,
            min: 0
        },
        timeSpent: {
            type: Number, // in seconds
            default: 0
        }
    }],
    score: {
        type: Number, // percentage
        required: true,
        min: 0,
        max: 100
    },
    totalPoints: {
        type: Number,
        required: true,
        min: 0
    },
    passed: {
        type: Boolean,
        required: true
    },
    timeStarted: {
        type: Date,
        required: true
    },
    timeCompleted: {
        type: Date,
        required: true
    },
    duration: {
        type: Number, // in seconds
        required: true
    },
    feedback: {
        type: String,
        trim: true
    },
    improvementSuggestions: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true
});

// Compound index for unique attempts
userQuizAttemptSchema.index({ userId: 1, quizId: 1, attemptNumber: 1 }, { unique: true });
userQuizAttemptSchema.index({ userId: 1, quizId: 1 });

const UserQuizAttempt = mongoose.model('UserQuizAttempt', userQuizAttemptSchema);
export default UserQuizAttempt;