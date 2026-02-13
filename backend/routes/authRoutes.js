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
    getAllUsers,
    oauthSuccess
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
import { checkOauthConfig } from '../middleware/oauthCheck.js';

import passport from 'passport';

const router = express.Router();

/**
 * Authentication Routes
 */

// Google OAuth Routes
router.get('/google', checkOauthConfig('google'), passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    oauthSuccess
);

// GitHub OAuth Routes
router.get('/github', checkOauthConfig('github'), passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback',
    passport.authenticate('github', { session: false, failureRedirect: '/login' }),
    oauthSuccess
);

// LinkedIn OAuth Routes
router.get('/linkedin', checkOauthConfig('linkedin'), passport.authenticate('linkedin', { state: 'SOME_STATE' }));
router.get('/linkedin/callback',
    passport.authenticate('linkedin', { session: false, failureRedirect: '/login' }),
    oauthSuccess
);

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
