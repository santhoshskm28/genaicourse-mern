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

export default {
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser,
    getAllCourses,
    getDashboardStats
};
