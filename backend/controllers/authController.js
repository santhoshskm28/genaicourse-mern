import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

/**
 * Authentication Controller
 * Handles user registration, login, and profile management
 */

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
    try {
        const { name, email, password, role = 'student', profile = {} } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Role validation (only admin can create instructor or admin roles)
        let userRole = role;
        if (role !== 'student') {
            // Check if creator is admin or if it's the first user (who becomes admin)
            const userCount = await User.countDocuments();
            if (userCount > 0) {
                const currentUser = await User.findById(req.user?._id);
                if (!currentUser || currentUser.role !== 'admin') {
                    userRole = 'student';
                }
            } else {
                userRole = 'admin'; // First user becomes admin
            }
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: userRole,
            profile: profile,
            isVerified: userRole === 'admin' // Auto-verify admins
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: `${userRole} registered successfully`,
            data: {
                user: user.getPublicProfile(),
                token
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user and include password
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Your account has been deactivated'
            });
        }

        // Check password
        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Update last login
        user.lastLoginAt = new Date();
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: user.getPublicProfile(),
                token
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate('enrolledCourses', 'title description thumbnail');

        res.status(200).json({
            success: true,
            data: user.getPublicProfile()
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
    try {
        const { name, email, profile, preferences } = req.body;

        const user = await User.findById(req.user._id);

        if (name) user.name = name;
        if (email) user.email = email;
        if (profile) user.profile = { ...user.profile, ...profile };
        if (preferences) user.preferences = { ...user.preferences, ...preferences };

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: user.getPublicProfile()
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
export const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user._id).select('+password');

        // Check current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No user found with this email'
            });
        }

        // Generate reset token (simplified - in production, use crypto and email service)
        const resetToken = Math.random().toString(36).substring(2, 15);
        user.passwordResetToken = resetToken;
        user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset token generated',
            data: { resetToken } // In production, send via email
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Reset password
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;

        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        // Update password
        user.password = newPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successful'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Verify email
 * @route   POST /api/auth/verify-email
 * @access  Public
 */
export const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.body;

        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid verification token'
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Email verified successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = async (req, res, next) => {
    try {
        // In a production environment, you might want to blacklist the token
        // For now, just return success - client should remove the token
        
        res.status(200).json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all users (admin only)
 * @route   GET /api/auth/users
 * @access  Private (Admin)
 */
export const getAllUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, role, search } = req.query;
        
        const query = {};
        if (role) query.role = role;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                users,
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

export default { 
    register, 
    login, 
    getMe, 
    updateProfile, 
    changePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
    logout,
    getAllUsers
};
