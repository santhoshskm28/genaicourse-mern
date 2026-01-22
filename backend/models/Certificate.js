import mongoose from 'mongoose';

/**
 * Certificate Schema
 * Tracks user course completion certificates
 */
const certificateSchema = new mongoose.Schema({
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
    certificateId: {
        type: String,
        required: true,
        unique: true
    },
    userName: {
        type: String,
        required: true,
        trim: true
    },
    courseTitle: {
        type: String,
        required: true,
        trim: true
    },
    completionDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    grade: {
        type: String,
        enum: ['A', 'B', 'C', 'Pass'],
        default: 'Pass'
    },
    score: {
        type: Number,
        min: 0,
        max: 100
    },
    totalTimeSpent: {
        type: Number, // in minutes
        required: true,
        default: 0
    },
    modulesCompleted: {
        type: Number,
        required: true,
        default: 0
    },
    totalModules: {
        type: Number,
        required: true,
        default: 0
    },
    skillsAcquired: [{
        type: String,
        trim: true
    }],
    instructorSignature: {
        type: String,
        trim: true
    },
    instructorName: {
        type: String,
        trim: true
    },
    certificateUrl: {
        type: String,
        trim: true
    },
    verificationUrl: {
        type: String,
        trim: true
    },
    isRevoked: {
        type: Boolean,
        default: false
    },
    revokedAt: {
        type: Date
    },
    revokedReason: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Index for verification
certificateSchema.index({ userId: 1, courseId: 1 }, { unique: true });
certificateSchema.index({ completionDate: -1 });

// Pre-save to generate certificate ID
certificateSchema.pre('save', function (next) {
    if (this.isNew && !this.certificateId) {
        this.certificateId = this.generateCertificateId();
    }
    next();
});

// Method to generate unique certificate ID
certificateSchema.methods.generateCertificateId = function () {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `GENAI-${timestamp}-${random}`.toUpperCase();
};

// Virtual for completion percentage
certificateSchema.virtual('completionPercentage').get(function () {
    return this.totalModules > 0 ? (this.modulesCompleted / this.totalModules) * 100 : 0;
});

certificateSchema.set('toJSON', { virtuals: true });
certificateSchema.set('toObject', { virtuals: true });

const Certificate = mongoose.model('Certificate', certificateSchema);
export default Certificate;