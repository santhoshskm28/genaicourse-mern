import mongoose from 'mongoose';

/**
 * Course Schema
 * Supports structured JSON content with modules and lessons
 */
const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['video', 'text', 'interactive', 'quiz', 'assignment', 'lab'],
        default: 'text'
    },
    videoUrl: String,
    resources: [{
        title: {
            type: String,
            required: true,
            trim: true
        },
        type: {
            type: String,
            enum: ['pdf', 'link', 'code', 'download'],
            required: true
        },
        url: String,
        content: String,
        description: String
    }],
    keyPoints: [{
        type: String,
        trim: true
    }],
    learningObjectives: [{
        type: String,
        trim: true
    }],
    duration: {
        type: Number, // in minutes
        default: 0,
        min: 0
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    isRequired: {
        type: Boolean,
        default: true
    },
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
    },
    order: {
        type: Number,
        default: 0
    }
});

const moduleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    learningObjectives: [{
        type: String,
        trim: true
    }],
    prerequisites: [{
        type: String,
        trim: true
    }],
    lessons: [lessonSchema],
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
    },
    order: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: false
    }
});

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a course title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide a course description'],
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    thumbnail: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        required: true,
        enum: ['AI/ML', 'Web Development', 'Data Science', 'Cloud Computing', 'Human Resources', 'Other']
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    language: {
        type: String,
        default: 'english'
    },
    modules: [moduleSchema],
    quizzes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
    }],
    learningObjectives: [{
        type: String,
        trim: true
    }],
    prerequisites: [{
        type: String,
        trim: true
    }],
    targetAudience: [{
        type: String,
        trim: true
    }],
    whatYoullLearn: [{
        type: String,
        trim: true
    }],
    requirements: [{
        type: String,
        trim: true
    }],
    isFree: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        default: 0,
        min: 0
    },
    currency: {
        type: String,
        default: 'USD'
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    enrollmentCount: {
        type: Number,
        default: 0
    },
    completionCount: {
        type: Number,
        default: 0
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    ratingCount: {
        type: Number,
        default: 0
    },
    reviews: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            trim: true,
            maxlength: [1000, 'Review cannot be more than 1000 characters']
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    certificate: {
        hasCertificate: {
            type: Boolean,
            default: false
        },
        template: String,
        criteria: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    instructors: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        role: {
            type: String,
            enum: ['lead', 'assistant'],
            default: 'assistant'
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }],
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

// Index for better query performance
courseSchema.index({ title: 'text', description: 'text' });
courseSchema.index({ category: 1, isPublished: 1 });

// Virtual for total lessons count
courseSchema.virtual('totalLessons').get(function () {
    if (!this.modules || !Array.isArray(this.modules)) return 0;
    return this.modules.reduce((total, module) => {
        if (module.lessons && Array.isArray(module.lessons)) {
            return total + module.lessons.length;
        }
        return total;
    }, 0);
});

// Virtual for total duration
courseSchema.virtual('totalDuration').get(function () {
    if (!this.modules || !Array.isArray(this.modules)) return 0;
    return this.modules.reduce((total, module) => {
        if (module.lessons && Array.isArray(module.lessons)) {
            return total + module.lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0);
        }
        return total;
    }, 0);
});

// Virtual for completion rate
courseSchema.virtual('completionRate').get(function () {
    return this.enrollmentCount > 0 ? (this.completionCount / this.enrollmentCount) * 100 : 0;
});

// Method to add review
courseSchema.methods.addReview = function (userId, rating, comment) {
    // Remove existing review by the same user
    this.reviews = this.reviews.filter(review =>
        review.userId.toString() !== userId.toString()
    );

    // Add new review
    this.reviews.push({
        userId: userId,
        rating: rating,
        comment: comment
    });

    // Update average rating
    this.ratingCount = this.reviews.length;
    this.averageRating = this.reviews.reduce((sum, review) => sum + review.rating, 0) / this.ratingCount;

    return this.save();
};

// Method to get lesson by index
courseSchema.methods.getLessonByIndex = function (moduleIndex, lessonIndex) {
    if (this.modules[moduleIndex] && this.modules[moduleIndex].lessons[lessonIndex]) {
        return this.modules[moduleIndex].lessons[lessonIndex];
    }
    return null;
};

// Ensure virtuals are included in JSON
courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

const Course = mongoose.model('Course', courseSchema);

export default Course;
