import User from '../models/User.js';
import Course from '../models/Course.js';
import UserProgress from '../models/UserProgress.js';

/**
 * Admin Controller
 * Handles admin-specific operations
 */

/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find()
            .select('-password')
            .populate('enrolledCourses', 'title')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get user by ID (Admin only)
 * @route   GET /api/admin/users/:id
 * @access  Private/Admin
 */
export const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate('enrolledCourses', 'title description');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get user's progress in all courses
        const progress = await UserProgress.find({ userId: req.params.id })
            .populate('courseId', 'title');

        res.status(200).json({
            success: true,
            data: {
                user,
                progress
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update user role (Admin only)
 * @route   PUT /api/admin/users/:id/role
 * @access  Private/Admin
 */
export const updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User role updated successfully',
            data: user
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete user (Admin only)
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Don't allow deleting yourself
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'You cannot delete your own account'
            });
        }

        await user.deleteOne();

        // Delete user's progress
        await UserProgress.deleteMany({ userId: req.params.id });

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all courses including unpublished (Admin only)
 * @route   GET /api/admin/courses
 * @access  Private/Admin
 */
export const getAllCourses = async (req, res, next) => {
    try {
        const courses = await Course.find()
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create new course (Admin only)
 * @route   POST /api/admin/courses
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
 * @route   PUT /api/admin/courses/:id
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
 * @route   DELETE /api/admin/courses/:id
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
 * @desc    Get single course (Admin only)
 * @route   GET /api/admin/courses/:id
 * @access  Private/Admin
 */
export const getCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('createdBy', 'name email')
            .populate('instructors.userId', 'name email profile');

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
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
 * @desc    Get dashboard statistics (Admin only)
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
export const getDashboardStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalCourses = await Course.countDocuments();
        const publishedCourses = await Course.countDocuments({ isPublished: true });
        const totalEnrollments = await UserProgress.countDocuments();

        // Get recent users
        const recentUsers = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(5);

        // Get popular courses
        const popularCourses = await Course.find({ isPublished: true })
            .sort({ enrollmentCount: -1 })
            .limit(5)
            .select('title enrollmentCount');

        // Get category distribution
        const categoryStats = await Course.aggregate([
            { $match: { isPublished: true } },
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalUsers,
                    totalCourses,
                    publishedCourses,
                    totalEnrollments
                },
                recentUsers,
                popularCourses,
                categoryStats
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Upload course from JSON (Admin only)
 * @route   POST /api/admin/courses/json
 * @access  Private/Admin
 */
export const uploadCourseFromJSON = async (req, res, next) => {
    try {
        const courseData = req.body;

        // Basic validation
        if (!courseData.title || !courseData.description || !courseData.modules || !Array.isArray(courseData.modules)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid JSON: Course must have title, description, and modules array'
            });
        }

        // Normalize field names to match schema
        if (courseData.modules && Array.isArray(courseData.modules)) {
            courseData.modules = courseData.modules.map(module => ({
                title: module.moduleTitle || module.title || 'Untitled Module',
                description: module.description || '',
                lessons: (module.lessons && Array.isArray(module.lessons))
                    ? module.lessons.map(lesson => ({
                        title: lesson.lessonTitle || lesson.title || 'Untitled Lesson',
                        content: lesson.content || 'No content provided',
                        type: lesson.type || 'text',
                        keyPoints: lesson.keyPoints || []
                    }))
                    : []
            }));
        } else {
            courseData.modules = [];
        }



        // Add metadata
        if (req.user && req.user._id) {
            courseData.createdBy = req.user._id;
        } else {
            // For testing, use a default admin ID or skip
            const defaultAdmin = await User.findOne({ role: 'admin' });
            if (defaultAdmin) {
                courseData.createdBy = defaultAdmin._id;
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'No admin user found'
                });
            }
        }
        courseData.isPublished = true; // Assume published when uploaded

        const course = new Course(courseData);
        await course.save();

        console.log('Course saved successfully:', course.title);
        res.status(201).json({
            success: true,
            message: 'Course uploaded successfully from JSON',
            data: course
        });
    } catch (error) {
        console.error('JSON Upload Error:', error.message);
        console.error('Full error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: Object.values(error.errors).map(e => e.message)
            });
        }
        next(error);
    }
};

/**
 * @desc    Get all students enrolled in a specific course (Admin only)
 * @route   GET /api/admin/courses/:id/enrollments
 * @access  Private/Admin
 */
export const getCourseEnrollments = async (req, res, next) => {
    try {
        const enrollments = await UserProgress.find({ courseId: req.params.id })
            .populate('userId', 'name email profile.avatar')
            .sort({ enrolledAt: -1 });

        res.status(200).json({
            success: true,
            count: enrollments.length,
            data: enrollments
        });
    } catch (error) {
        next(error);
    }
};

export default {
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser,
    getAllCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    uploadCourseFromJSON,
    getDashboardStats,
    getCourseEnrollments
};
