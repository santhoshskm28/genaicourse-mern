import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Schema
 * Handles user authentication and role-based access control
 */
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },
    password: {
        type: String,
        required: function () {
            return !this.googleId && !this.githubId && !this.linkedinId;
        },
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't return password by default
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    githubId: {
        type: String,
        unique: true,
        sparse: true
    },
    linkedinId: {
        type: String,
        unique: true,
        sparse: true
    },
    provider: {
        type: String,
        enum: ['local', 'google', 'github', 'linkedin'],
        default: 'local'
    },
    // Password Reset Fields (Secure Implementation)
    resetPasswordToken: {
        type: String,
        select: false // Never return in queries
    },
    resetPasswordExpire: {
        type: Date,
        select: false // Never return in queries
    },
    role: {
        type: String,
        enum: ['student', 'instructor', 'admin'],
        default: 'student'
    },
    profile: {
        avatar: {
            type: String,
            default: ''
        },
        bio: {
            type: String,
            maxlength: [500, 'Bio cannot be more than 500 characters']
        },
        expertise: [{
            type: String,
            trim: true
        }],
        linkedin: String,
        github: String,
        website: String,
        location: {
            type: String,
            trim: true
        },
        timezone: {
            type: String,
            default: 'UTC'
        }
    },
    preferences: {
        notifications: {
            email: {
                type: Boolean,
                default: true
            },
            push: {
                type: Boolean,
                default: true
            },
            courseUpdates: {
                type: Boolean,
                default: true
            },
            achievements: {
                type: Boolean,
                default: true
            }
        },
        learning: {
            dailyGoal: {
                type: Number, // in minutes
                default: 30
            },
            preferredDifficulty: {
                type: String,
                enum: ['Beginner', 'Intermediate', 'Advanced'],
                default: 'Beginner'
            },
            preferredLanguage: {
                type: String,
                default: 'english'
            }
        }
    },
    stats: {
        totalTimeSpent: {
            type: Number, // in minutes
            default: 0
        },
        coursesCompleted: {
            type: Number,
            default: 0
        },
        certificatesEarned: {
            type: Number,
            default: 0
        },
        averageScore: {
            type: Number,
            default: 0
        },
        streak: {
            current: {
                type: Number,
                default: 0
            },
            longest: {
                type: Number,
                default: 0
            }
        }
    },
    enrolledCourses: [{
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true
        },
        enrolledAt: {
            type: Date,
            default: Date.now
        },
        completedAt: Date,
        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        lastAccessedAt: {
            type: Date,
            default: Date.now
        },
        timeSpent: {
            type: Number, // in minutes
            default: 0
        },
        isCompleted: {
            type: Boolean,
            default: false
        },
        certificate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Certificate'
        }
    }],
    createdCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    learningPaths: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LearningPath'
    }],
    achievements: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Achievement'
    }],
    lastLoginAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Import crypto for token generation
import crypto from 'crypto';

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to get signed reset token
userSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expire (15 minutes from .env or fallback)
    const expireMinutes = parseInt(process.env.RESET_TOKEN_EXPIRE) || 15;
    this.resetPasswordExpire = Date.now() + expireMinutes * 60 * 1000;

    return resetToken;
};

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile
userSchema.methods.getPublicProfile = function () {
    return {
        _id: this._id,
        name: this.name,
        email: this.email,
        role: this.role,
        profile: this.profile,
        stats: this.stats,
        enrolledCourses: this.enrolledCourses,
        createdAt: this.createdAt
    };
};

// Method to check if user is enrolled in course
userSchema.methods.isEnrolledInCourse = function (courseId) {
    return this.enrolledCourses.some(enrollment =>
        enrollment.courseId.toString() === courseId.toString()
    );
};

// Method to enroll in course
userSchema.methods.enrollInCourse = function (courseId) {
    if (!this.isEnrolledInCourse(courseId)) {
        this.enrolledCourses.push({
            courseId: courseId,
            enrolledAt: new Date(),
            progress: 0,
            timeSpent: 0,
            isCompleted: false
        });
        return true;
    }
    return false;
};

// Method to update course progress
userSchema.methods.updateCourseProgress = function (courseId, progress, timeSpent) {
    const enrollment = this.enrolledCourses.find(e =>
        e.courseId.toString() === courseId.toString()
    );

    if (enrollment) {
        enrollment.progress = Math.max(0, Math.min(100, progress));
        enrollment.lastAccessedAt = new Date();
        if (timeSpent) enrollment.timeSpent += timeSpent;

        if (progress === 100 && !enrollment.isCompleted) {
            enrollment.isCompleted = true;
            enrollment.completedAt = new Date();
            this.stats.coursesCompleted += 1;
        }

        return true;
    }
    return false;
};

const User = mongoose.model('User', userSchema);

export default User;
