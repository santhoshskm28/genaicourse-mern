import { body, validationResult } from 'express-validator';

/**
 * Validation Middleware
 * Validates request data before processing
 */

// Validation result handler
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

// User registration validation
export const registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// User login validation
export const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required')
];

// Course creation validation
export const courseValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Course title is required')
        .isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),

    body('description')
        .trim()
        .notEmpty().withMessage('Course description is required')
        .isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),

    body('category')
        .notEmpty().withMessage('Category is required')
        .isIn(['AI/ML', 'Web Development', 'Data Science', 'Cloud Computing', 'Other'])
        .withMessage('Invalid category'),

    body('level')
        .optional()
        .isIn(['Beginner', 'Intermediate', 'Advanced'])
        .withMessage('Invalid level')
];

// Forgot password validation
export const forgotPasswordValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail()
];

// Reset password validation
export const resetPasswordValidation = [
    body('token')
        .notEmpty().withMessage('Reset token is required'),
    
    body('newPassword')
        .notEmpty().withMessage('New password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// Email verification validation
export const emailVerificationValidation = [
    body('token')
        .notEmpty().withMessage('Verification token is required')
];

// Change password validation
export const changePasswordValidation = [
    body('currentPassword')
        .notEmpty().withMessage('Current password is required'),
    
    body('newPassword')
        .notEmpty().withMessage('New password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// Profile update validation
export const profileUpdateValidation = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    
    body('email')
        .optional()
        .trim()
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail()
];

export default { 
    validate, 
    registerValidation, 
    loginValidation, 
    courseValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    emailVerificationValidation,
    changePasswordValidation,
    profileUpdateValidation
};
