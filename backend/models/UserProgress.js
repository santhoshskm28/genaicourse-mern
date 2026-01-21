import mongoose from 'mongoose';

/**
 * User Progress Schema
 * Tracks user's progress through courses
 */
const userProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    completedLessons: [{
        moduleId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        lessonId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        completedAt: {
            type: Date,
            default: Date.now
        },
        timeSpent: {
            type: Number, // in minutes
            default: 0
        },
        score: {
            type: Number,
            min: 0,
            max: 100
        }
    }],
    completedQuizzes: [{
        quizId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Quiz',
            required: true
        },
        attemptId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserQuizAttempt',
            required: true
        },
        completedAt: {
            type: Date,
            default: Date.now
        },
        score: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        passed: {
            type: Boolean,
            required: true
        }
    }],
    currentModule: {
        type: Number,
        default: 0
    },
    currentLesson: {
        type: Number,
        default: 0
    },
    progressPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    totalTimeSpent: {
        type: Number, // in minutes
        default: 0
    },
    averageScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    lastAccessedAt: {
        type: Date,
        default: Date.now
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    },
    certificate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Certificate'
    },
    bookmarks: [{
        moduleId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        lessonId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        timestamp: Number, // video timestamp if applicable
        note: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    notes: [{
        moduleId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        lessonId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        content: {
            type: String,
            required: true,
            trim: true
        },
        timestamp: Number, // video timestamp if applicable
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Compound index for efficient queries
userProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

// Method to calculate progress percentage
userProgressSchema.methods.calculateProgress = function (totalLessons) {
    if (totalLessons === 0) return 0;
    this.progressPercentage = Math.round((this.completedLessons.length / totalLessons) * 100);
    return this.progressPercentage;
};

// Method to mark lesson as completed
userProgressSchema.methods.completeLesson = function(moduleId, lessonId, timeSpent = 0, score = null) {
    const existingLesson = this.completedLessons.find(lesson => 
        lesson.lessonId.toString() === lessonId.toString()
    );
    
    if (!existingLesson) {
        this.completedLessons.push({
            moduleId: moduleId,
            lessonId: lessonId,
            completedAt: new Date(),
            timeSpent: timeSpent,
            score: score
        });
        if (timeSpent) this.totalTimeSpent += timeSpent;
        return true;
    }
    return false;
};

// Method to add quiz completion
userProgressSchema.methods.completeQuiz = function(quizId, attemptId, score, passed) {
    this.completedQuizzes.push({
        quizId: quizId,
        attemptId: attemptId,
        completedAt: new Date(),
        score: score,
        passed: passed
    });
    
    // Update average score
    const allScores = [...this.completedQuizzes.map(q => q.score)];
    if (this.completedLessons.filter(l => l.score).length > 0) {
        allScores.push(...this.completedLessons.filter(l => l.score).map(l => l.score));
    }
    this.averageScore = allScores.reduce((sum, score) => sum + score, 0) / allScores.length;
};

// Method to add bookmark
userProgressSchema.methods.addBookmark = function(moduleId, lessonId, timestamp = null, note = '') {
    // Check if bookmark already exists
    const existingBookmark = this.bookmarks.find(bookmark => 
        bookmark.lessonId.toString() === lessonId.toString() && 
        bookmark.moduleId.toString() === moduleId.toString()
    );
    
    if (!existingBookmark) {
        this.bookmarks.push({
            moduleId: moduleId,
            lessonId: lessonId,
            timestamp: timestamp,
            note: note
        });
        return true;
    }
    return false;
};

// Method to add note
userProgressSchema.methods.addNote = function(moduleId, lessonId, content, timestamp = null) {
    const newNote = {
        moduleId: moduleId,
        lessonId: lessonId,
        content: content,
        timestamp: timestamp,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    
    this.notes.push(newNote);
    return newNote;
};

const UserProgress = mongoose.model('UserProgress', userProgressSchema);

export default UserProgress;
