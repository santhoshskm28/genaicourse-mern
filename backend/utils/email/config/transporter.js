import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * SMTP Email Transporter Configuration
 * 
 * Production-Ready Gmail SMTP Setup
 * 
 * Security Features:
 * - Uses App Password (NOT regular Gmail password)
 * - Secure authentication
 * - TLS encryption
 * 
 * Setup Instructions:
 * 1. Enable 2-Step Verification in your Google Account
 * 2. Go to: https://myaccount.google.com/apppasswords
 * 3. Generate an App Password for "Mail"
 * 4. Use the 16-character password in EMAIL_PASS
 * 
 * @returns {nodemailer.Transporter} Configured email transporter
 */

const createTransporter = () => {
    // Validate required environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('❌ EMAIL_USER and EMAIL_PASS must be set in environment variables');
        throw new Error('Email configuration missing');
    }

    const transporter = nodemailer.createTransporter({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // Use TLS
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        // Additional security options
        tls: {
            rejectUnauthorized: true,
            minVersion: 'TLSv1.2'
        }
    });

    // Verify transporter configuration
    transporter.verify((error, success) => {
        if (error) {
            console.error('❌ Email transporter verification failed:', error.message);
        } else {
            console.log('✅ Email server is ready to send messages');
        }
    });

    return transporter;
};

// Export singleton instance
const transporter = createTransporter();

export default transporter;
