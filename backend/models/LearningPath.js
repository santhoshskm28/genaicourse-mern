import mongoose from 'mongoose';

/**
 * Learning Path Schema
 * AI-powered personalized learning recommendations
 */
const learningPathSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    courses: [{
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true
        },
        order: {
            type: Number,
            required: true,
            min: 0
        },
        isCompleted: {
            type: Boolean,
            default: false
        },
        completionDate: Date,
        recommendedHours: {
            type: Number,
            default: 0
        },
        actualHours: {
            type: Number,
            default: 0
        }
    }],
    estimatedDuration: {
        type: Number, // in hours
        default: 0
    },
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },
    category: {
        type: String,
        enum: ['AI/ML', 'Web Development', 'Data Science', 'Cloud Computing', 'Other']
    },
    skillLevel: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    completedAt: Date,
    aiRecommendationScore: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.5
    },
    recommendationReasons: [{
        type: String,
        trim: true
    }],
    prerequisites: [{
        type: String,
        trim: true
    }],
    learningObjectives: [{
        type: String,
        trim: true
    }],
    targetSkills: [{
        type: String,
        trim: true
    }],
    startDate: {
        type: Date,
        default: Date.now
    },
    targetCompletionDate: Date
}, {
    timestamps: true
});

// Index for user learning paths
learningPathSchema.index({ userId: 1, isActive: 1 });
learningPathSchema.index({ userId: 1, progress: -1 });

// Pre-save to update progress
learningPathSchema.pre('save', function(next) {
    if (this.courses.length > 0) {
        const completedCourses = this.courses.filter(course => course.isCompleted).length;
        this.progress = (completedCourses / this.courses.length) * 100;
        this.isCompleted = this.progress === 100;
        if (this.isCompleted && !this.completedAt) {
            this.completedAt = new Date();
        }
    }
    next();
});

const LearningPath = mongoose.model('LearningPath', learningPathSchema);
export default LearningPath;