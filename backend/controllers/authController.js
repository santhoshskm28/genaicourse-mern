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

        // 🔥 SEND WELCOME EMAIL (Onboarding)
        try {
            const sendEmail = (await import('../utils/email/sendEmail.js')).default;
            const { welcomeTemplate } = await import('../utils/email/templates/welcomeTemplate.js');

            await sendEmail({
                to: user.email,
                subject: 'Welcome to GENAICOURSE.IO 🚀',
                html: welcomeTemplate(user.name)
            });
        } catch (emailError) {
            console.error('❌ Failed to send welcome email:', emailError.message);
        }

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

        // 🔥 SEND LOGIN SECURITY ALERT (Security Notification)
        try {
            const sendEmail = (await import('../utils/email/sendEmail.js')).default;
            const { loginAlertTemplate } = await import('../utils/email/templates/loginAlertTemplate.js');

            const time = new Date().toLocaleString();
            const ip = req.ip || req.headers['x-forwarded-for'] || 'Unknown';

            await sendEmail({
                to: user.email,
                subject: 'Security Alert: New Sign-in Detected - GENAICOURSE.IO',
                html: loginAlertTemplate(user.name, time, ip)
            });
        } catch (emailError) {
            console.error('❌ Failed to send login alert email:', emailError.message);
        }

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

/**
 * @desc    Handle OAuth success and redirect to frontend with token
 * @route   GET /api/auth/oauth/success
 * @access  Private (Internal)
 */
export const oauthSuccess = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication failed'
            });
        }


        const token = generateToken(req.user._id);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

        // Redirect to frontend with token
        res.redirect(`${frontendUrl}/oauth-callback?token=${token}`);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Forgot Password - Generate reset token and send email
 * @route   POST /api/auth/forgot-password
 * @access  Public
 * 
 * SECURITY IMPLEMENTATION:
 * 1. Generate cryptographically secure random token (via user model)
 * 2. Hash token using SHA256 before storing in database (via user model)
 * 3. Set expiration time (15 minutes) (via user model)
 * 4. Send reset link via email
 * 5. Never expose whether email exists (prevent user enumeration)
 */
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        // Validate email
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an email address'
            });
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });

        // SECURITY: Always return same message to prevent user enumeration
        const successMessage = 'If an account exists with this email, you will receive password reset instructions.';

        if (!user) {
            // Don't reveal that user doesn't exist
            return res.status(200).json({
                success: true,
                message: successMessage
            });
        }

        // Generate reset token using cryptographically secure model method
        const resetToken = user.getResetPasswordToken();

        // Save user (skips validation for other fields like password)
        await user.save({ validateBeforeSave: false });

        // Create reset URL with unhashed token
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // Send Email
        try {
            const sendEmail = (await import('../utils/email/sendEmail.js')).sendEmailWithRetry;
            const { resetPasswordTemplate } = await import('../utils/email/templates/resetPasswordTemplate.js');

            await sendEmail({
                to: user.email,
                subject: 'Password Reset Request - GENAICOURSE.IO',
                html: resetPasswordTemplate(user.name, resetUrl)
            }, 3); // Critical email: retry up to 3 times

            res.status(200).json({
                success: true,
                message: successMessage
            });

        } catch (emailError) {
            // If email fails, clear reset fields
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });

            console.error('❌ Failed to send password reset email:', emailError);

            return res.status(500).json({
                success: false,
                message: 'Email could not be sent. Please try again later.'
            });
        }

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Reset Password - Validate token and update password
 * @route   PUT /api/auth/reset-password/:resetToken
 * @access  Public
 */
export const resetPassword = async (req, res, next) => {
    try {
        const { resetToken } = req.params;
        const { password } = req.body;

        // Validate password
        if (!password) {
            return res.status(400).json({ success: false, message: 'Please provide a new password' });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        }

        // Hash incoming token to match database
        const crypto = await import('crypto');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Find user with valid token and not expired
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
        }

        // Set new password (auto-hashed by pre-save hook)
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        // Send confirmation email
        try {
            const sendEmail = (await import('../utils/email/sendEmail.js')).default;
            const { resetConfirmationTemplate } = await import('../utils/email/templates/resetConfirmationTemplate.js');

            await sendEmail({
                to: user.email,
                subject: 'Password Reset Successful - GENAICOURSE.IO',
                html: resetConfirmationTemplate(user.name)
            });
        } catch (emailError) {
            console.error('❌ Failed to send confirmation email:', emailError);
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Password reset successful',
            data: { user: user.getPublicProfile(), token }
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
    getAllUsers,
    oauthSuccess
};
