import Course from '../models/Course.js';
import UserProgress from '../models/UserProgress.js';
import User from '../models/User.js';

/**
 * Course Controller
 * Handles all course-related operations
 */

/**
 * @desc    Get all published courses
 * @route   GET /api/courses
 * @access  Public
 */
export const getCourses = async (req, res, next) => {
    try {
        const { category, level, search } = req.query;

        // Build query
        let query = { isPublished: true };

        if (category) {
            query.category = category;
        }

        if (level) {
            query.level = level;
        }

        if (search) {
            query.$text = { $search: search };
        }

        const { page = 1, limit = 10, sortBy = 'createdAt' } = req.query;
        const sortOptions = {
            createdAt: -1,
            enrollmentCount: -1,
            averageRating: -1,
            title: 1
        };

        const courses = await Course.find(query)
            .populate('createdBy', 'name')
            .sort({ [sortBy]: sortOptions[sortBy] })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const total = await Course.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                courses,
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
 * @desc    Get single course by ID
 * @route   GET /api/courses/:id
 * @access  Public
 */
export const getCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('createdBy', 'name email')
            .populate('instructors.userId', 'name email profile')
            .populate('reviews.userId', 'name profile.avatar');

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Only show published courses to non-admin users
        if (!course.isPublished && (!req.user || req.user.role !== 'admin')) {
            return res.status(403).json({
                success: false,
                message: 'This course is not available'
            });
        }

        res.status(200).json({
            success: true,
            data: course
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create a new course (Admin only)
 * @route   POST /api/courses
 * @access  Private/Admin
 */
export const createCourse = async (req, res, next) => {
    try {
        const courseData = {
            ...req.body,
            createdBy: req.user._id
        };

        const course = await Course.create(courseData);

        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            data: course
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update course (Admin only)
 * @route   PUT /api/courses/:id
 * @access  Private/Admin
 */
export const updateCourse = async (req, res, next) => {
    try {
        let course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        course = await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: 'Course updated successfully',
            data: course
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete course (Admin only)
 * @route   DELETE /api/courses/:id
 * @access  Private/Admin
 */
export const deleteCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        await course.deleteOne();

        // Also delete all user progress for this course
        await UserProgress.deleteMany({ courseId: req.params.id });

        res.status(200).json({
            success: true,
            message: 'Course deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Enroll in a course
 * @route   POST /api/courses/:id/enroll
 * @access  Private
 */
export const enrollCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        if (!course.isPublished) {
            return res.status(400).json({
                success: false,
                message: 'This course is not available for enrollment'
            });
        }

        // Check if already enrolled
        const existingProgress = await UserProgress.findOne({
            userId: req.user._id,
            courseId: req.params.id
        });

        if (existingProgress) {
            return res.status(400).json({
                success: false,
                message: 'You are already enrolled in this course'
            });
        }

        // Create progress record
        await UserProgress.create({
            userId: req.user._id,
            courseId: req.params.id
        });

        // Update user's enrolled courses
        const user = await User.findById(req.user._id);
        user.enrollInCourse(req.params.id);
        await user.save();

        // Increment enrollment count
        course.enrollmentCount += 1;
        await course.save();

        res.status(200).json({
            success: true,
            message: 'Successfully enrolled in course'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get course progress for current user
 * @route   GET /api/courses/:id/progress
 * @access  Private
 */
export const getCourseProgress = async (req, res, next) => {
    try {
        const progress = await UserProgress.findOne({
            userId: req.user._id,
            courseId: req.params.id
        }).populate('courseId', 'title modules');

        if (!progress) {
            return res.status(404).json({
                success: false,
                message: 'You are not enrolled in this course'
            });
        }

        res.status(200).json({
            success: true,
            data: progress
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update course progress
 * @route   PUT /api/courses/:id/progress
 * @access  Private
 */
export const updateCourseProgress = async (req, res, next) => {
    try {
        const { moduleId, lessonId, currentModule, currentLesson } = req.body;

        let progress = await UserProgress.findOne({
            userId: req.user._id,
            courseId: req.params.id
        });

        if (!progress) {
            return res.status(404).json({
                success: false,
                message: 'You are not enrolled in this course'
            });
        }

        // Add completed lesson if provided
        if (moduleId && lessonId) {
            const alreadyCompleted = progress.completedLessons.some(
                lesson => lesson.moduleId.toString() === moduleId && lesson.lessonId.toString() === lessonId
            );

            if (!alreadyCompleted) {
                progress.completedLessons.push({ moduleId, lessonId });
            }
        }

        // Update current position
        if (currentModule !== undefined) progress.currentModule = currentModule;
        if (currentLesson !== undefined) progress.currentLesson = currentLesson;

        // Get course to calculate progress
        const course = await Course.findById(req.params.id);
        const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);

        progress.calculateProgress(totalLessons);
        progress.lastAccessedAt = new Date();

        // Check if course is completed
        if (progress.progressPercentage === 100 && !progress.completedAt) {
            progress.completedAt = new Date();
        }

        await progress.save();

        res.status(200).json({
            success: true,
            message: 'Progress updated successfully',
            data: progress
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Add review to course
 * @route   POST /api/courses/:id/reviews
 * @access  Private
 */
export const addReview = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;
        const courseId = req.params.id;

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Check if user is enrolled
        const progress = await UserProgress.findOne({
            userId: req.user._id,
            courseId: courseId
        });

        if (!progress) {
            return res.status(403).json({
                success: false,
                message: 'You must be enrolled in this course to leave a review'
            });
        }

        // Add review
        await course.addReview(req.user._id, rating, comment);

        res.status(201).json({
            success: true,
            message: 'Review added successfully',
            data: course
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get user's enrolled courses
 * @route   GET /api/courses/enrolled
 * @access  Private
 */
export const getEnrolledCourses = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        
        const userProgress = await UserProgress.find({ userId: req.user._id })
            .populate('courseId', 'title thumbnail category level averageRating')
            .sort({ lastAccessedAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        // Filter by status if provided
        let filteredProgress = userProgress;
        if (status === 'completed') {
            filteredProgress = userProgress.filter(p => p.progressPercentage === 100);
        } else if (status === 'in-progress') {
            filteredProgress = userProgress.filter(p => p.progressPercentage > 0 && p.progressPercentage < 100);
        } else if (status === 'not-started') {
            filteredProgress = userProgress.filter(p => p.progressPercentage === 0);
        }

        const total = await UserProgress.countDocuments({ userId: req.user._id });

        res.status(200).json({
            success: true,
            data: {
                courses: filteredProgress,
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
 * @desc    Add bookmark to lesson
 * @route   POST /api/courses/:id/bookmarks
 * @access  Private
 */
export const addBookmark = async (req, res, next) => {
    try {
        const { moduleId, lessonId, timestamp, note } = req.body;
        const courseId = req.params.id;

        let progress = await UserProgress.findOne({
            userId: req.user._id,
            courseId: courseId
        });

        if (!progress) {
            return res.status(404).json({
                success: false,
                message: 'You are not enrolled in this course'
            });
        }

        const success = progress.addBookmark(moduleId, lessonId, timestamp, note);
        
        if (!success) {
            return res.status(400).json({
                success: false,
                message: 'Bookmark already exists'
            });
        }

        await progress.save();

        res.status(201).json({
            success: true,
            message: 'Bookmark added successfully',
            data: progress.bookmarks
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get course bookmarks
 * @route   GET /api/courses/:id/bookmarks
 * @access  Private
 */
export const getBookmarks = async (req, res, next) => {
    try {
        const progress = await UserProgress.findOne({
            userId: req.user._id,
            courseId: req.params.id
        });

        if (!progress) {
            return res.status(404).json({
                success: false,
                message: 'You are not enrolled in this course'
            });
        }

        res.status(200).json({
            success: true,
            data: progress.bookmarks
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Add note to lesson
 * @route   POST /api/courses/:id/notes
 * @access  Private
 */
export const addNote = async (req, res, next) => {
    try {
        const { moduleId, lessonId, content, timestamp } = req.body;
        const courseId = req.params.id;

        let progress = await UserProgress.findOne({
            userId: req.user._id,
            courseId: courseId
        });

        if (!progress) {
            return res.status(404).json({
                success: false,
                message: 'You are not enrolled in this course'
            });
        }

        const newNote = progress.addNote(moduleId, lessonId, content, timestamp);
        await progress.save();

        res.status(201).json({
            success: true,
            message: 'Note added successfully',
            data: newNote
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get course notes
 * @route   GET /api/courses/:id/notes
 * @access  Private
 */
export const getNotes = async (req, res, next) => {
    try {
        const progress = await UserProgress.findOne({
            userId: req.user._id,
            courseId: req.params.id
        });

        if (!progress) {
            return res.status(404).json({
                success: false,
                message: 'You are not enrolled in this course'
            });
        }

        res.status(200).json({
            success: true,
            data: progress.notes
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get course analytics (instructor/admin only)
 * @route   GET /api/courses/:id/analytics
 * @access  Private (Instructor, Admin)
 */
export const getCourseAnalytics = async (req, res, next) => {
    try {
        const courseId = req.params.id;
        
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Check if user is instructor or admin
        if (course.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view course analytics'
            });
        }

        // Get enrollment and completion data
        const totalEnrollments = await UserProgress.countDocuments({ courseId });
        const completions = await UserProgress.countDocuments({ 
            courseId, 
            progressPercentage: 100 
        });
        const inProgress = totalEnrollments - completions;

        // Get average progress
        const progressData = await UserProgress.aggregate([
            { $match: { courseId: course._id } },
            {
                $group: {
                    _id: null,
                    avgProgress: { $avg: '$progressPercentage' },
                    avgTimeSpent: { $avg: '$totalTimeSpent' }
                }
            }
        ]);

        // Get lesson completion data
        const lessonStats = await UserProgress.aggregate([
            { $match: { courseId: course._id } },
            { $unwind: '$completedLessons' },
            {
                $group: {
                    _id: '$completedLessons.lessonId',
                    completionCount: { $sum: 1 }
                }
            },
            { $sort: { completionCount: -1 } }
        ]);

        const analytics = {
            overview: {
                totalEnrollments,
                completions,
                inProgress,
                completionRate: totalEnrollments > 0 ? (completions / totalEnrollments) * 100 : 0,
                averageProgress: progressData[0]?.avgProgress || 0,
                averageTimeSpent: progressData[0]?.avgTimeSpent || 0
            },
            lessonStats,
            ratingStats: {
                averageRating: course.averageRating,
                totalReviews: course.ratingCount
            },
            trendData: {
                enrollmentTrend: await getEnrollmentTrend(courseId),
                completionTrend: await getCompletionTrend(courseId)
            }
        };

        res.status(200).json({
            success: true,
            data: analytics
        });
    } catch (error) {
        next(error);
    }
};

// Helper function for enrollment trend
const getEnrollmentTrend = async (courseId) => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    return await UserProgress.aggregate([
        { $match: { courseId, enrolledAt: { $gte: thirtyDaysAgo } } },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$enrolledAt' } },
                count: { $sum: 1 }
            }
        },
        { $sort: { '_id': 1 } }
    ]);
};

// Helper function for completion trend
const getCompletionTrend = async (courseId) => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    return await UserProgress.aggregate([
        { $match: { courseId, completedAt: { $gte: thirtyDaysAgo } } },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } },
                count: { $sum: 1 }
            }
        },
        { $sort: { '_id': 1 } }
    ]);
};

export default {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    enrollCourse,
    getCourseProgress,
    updateCourseProgress,
    addReview,
    getEnrolledCourses,
    addBookmark,
    getBookmarks,
    addNote,
    getNotes,
    getCourseAnalytics
};
