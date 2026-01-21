import mongoose from 'mongoose';

/**
 * Quiz Schema
 * Interactive assessments for lessons and modules
 */
const questionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['multiple-choice', 'true-false', 'short-answer', 'coding', 'fill-blank'],
        required: true
    },
    question: {
        type: String,
        required: true,
        trim: true
    },
    options: [{
        text: String,
        isCorrect: {
            type: Boolean,
            default: false
        },
        explanation: String
    }],
    correctAnswer: String,
    explanation: {
        type: String,
        trim: true
    },
    points: {
        type: Number,
        default: 1,
        min: 1
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    tags: [{
        type: String,
        trim: true
    }]
});

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: [200, 'Title cannot be more than 200 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    questions: [questionSchema],
    timeLimit: {
        type: Number, // in minutes
        default: null // null for no time limit
    },
    passingScore: {
        type: Number,
        default: 70, // percentage
        min: 0,
        max: 100
    },
    maxAttempts: {
        type: Number,
        default: 3,
        min: 1
    },
    shuffleQuestions: {
        type: Boolean,
        default: false
    },
    shuffleOptions: {
        type: Boolean,
        default: false
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course.modules'
    },
    lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course.modules.lessons'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Virtual for total points
quizSchema.virtual('totalPoints').get(function () {
    return this.questions.reduce((total, question) => total + question.points, 0);
});

// Virtual for average difficulty
quizSchema.virtual('averageDifficulty').get(function () {
    if (this.questions.length === 0) return 'medium';
    
    const difficultyMap = { easy: 1, medium: 2, hard: 3 };
    const avgDifficulty = this.questions.reduce((sum, q) => 
        sum + difficultyMap[q.difficulty], 0) / this.questions.length;
    
    return avgDifficulty <= 1.5 ? 'easy' : avgDifficulty <= 2.5 ? 'medium' : 'hard';
});

// Index for better query performance
quizSchema.index({ courseId: 1, isPublished: 1 });
quizSchema.index({ createdBy: 1 });

quizSchema.set('toJSON', { virtuals: true });
quizSchema.set('toObject', { virtuals: true });

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;