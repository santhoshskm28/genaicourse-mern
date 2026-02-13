/**
 * Email Transporter Configuration
 * 
 * SECURITY NOTES:
 * - Uses Gmail App Password (NOT regular password)
 * - Supports TLS encryption
 * - Production-ready with error handling
 * - Easily swappable for SendGrid/SES
 */

import nodemailer from 'nodemailer';

/**
 * Create reusable transporter object using SMTP transport
 * 
 * @security Gmail App Password Setup:
 * 1. Enable 2FA on Gmail account
 * 2. Go to Google Account → Security → 2-Step Verification
 * 3. Scroll to "App passwords"
 * 4. Generate app password for "Mail"
 * 5. Use that 16-character password in EMAIL_PASS
 */
const createTransporter = () => {
    // Validate required environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('❌ EMAIL_USER and EMAIL_PASS must be set in environment variables');
        throw new Error('Email configuration missing');
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        // Security options
        secure: true, // Use TLS
        tls: {
            rejectUnauthorized: true
        }
    });

    // Verify connection configuration
    transporter.verify((error, success) => {
        if (error) {
            console.error('❌ Email transporter verification failed:', error);
        } else {
            console.log('✅ Email server is ready to send messages');
        }
    });

    return transporter;
};

// Singleton pattern - create once, reuse everywhere
let transporter = null;

export const getTransporter = () => {
    if (!transporter) {
        transporter = createTransporter();
    }
    return transporter;
};

export default getTransporter;

/**
 * PRODUCTION MIGRATION GUIDE:
 * 
 * 🔄 To migrate to SendGrid:
 * 
 * const transporter = nodemailer.createTransport({
 *     host: 'smtp.sendgrid.net',
 *     port: 587,
 *     auth: {
 *         user: 'apikey',
 *         pass: process.env.SENDGRID_API_KEY
 *     }
 * });
 * 
 * 🔄 To migrate to Amazon SES:
 * 
 * import aws from '@aws-sdk/client-ses';
 * const ses = new aws.SES({
 *     apiVersion: '2010-12-01',
 *     region: 'us-east-1',
 *     credentials: {
 *         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
 *         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
 *     }
 * });
 * 
 * const transporter = nodemailer.createTransport({
 *     SES: { ses, aws }
 * });
 */
