import express from 'express';
import {
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
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';
import { 
    registerValidation, 
    loginValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    emailVerificationValidation,
    changePasswordValidation,
    profileUpdateValidation,
    validate 
} from '../middleware/validation.js';

const router = express.Router();

/**
 * Authentication Routes
 */

// Public routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/forgot-password', forgotPasswordValidation, validate, forgotPassword);
router.post('/reset-password', resetPasswordValidation, validate, resetPassword);
router.post('/verify-email', emailVerificationValidation, validate, verifyEmail);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, profileUpdateValidation, validate, updateProfile);
router.put('/change-password', protect, changePasswordValidation, validate, changePassword);
router.post('/logout', protect, logout);

// Admin routes
router.get('/users', protect, authorize('admin'), getAllUsers);

export default router;
