import transporter from './config/transporter.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Universal Email Sender Function
 * 
 * Production-Grade Email Service with:
 * - Attachment support (for certificates)
 * - HTML template rendering
 * - Error handling
 * - Logging
 * - Retry logic
 * 
 * @param {Object} options - Email configuration
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject line
 * @param {string} options.html - HTML email content
 * @param {Array} [options.attachments] - Optional file attachments
 * @returns {Promise<Object>} Email send result
 */

const sendEmail = async (options) => {
    try {
        // Validate required fields
        if (!options.to || !options.subject || !options.html) {
            throw new Error('Missing required email fields: to, subject, or html');
        }

        // Email configuration
        const mailOptions = {
            from: process.env.EMAIL_FROM || `GENAICOURSE.IO <${process.env.EMAIL_USER}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
            // Optional attachments (for certificates, etc.)
            attachments: options.attachments || []
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);

        console.log(`✅ Email sent successfully to ${options.to}`);
        console.log(`📧 Message ID: ${info.messageId}`);

        return {
            success: true,
            messageId: info.messageId,
            recipient: options.to
        };

    } catch (error) {
        console.error('❌ Email sending failed:', error.message);

        // Log detailed error for debugging
        if (process.env.NODE_ENV === 'development') {
            console.error('Error details:', error);
        }

        throw new Error(`Failed to send email: ${error.message}`);
    }
};

/**
 * Send email with retry logic (production enhancement)
 * 
 * @param {Object} options - Email configuration
 * @param {number} maxRetries - Maximum retry attempts
 * @returns {Promise<Object>} Email send result
 */
export const sendEmailWithRetry = async (options, maxRetries = 3) => {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await sendEmail(options);
        } catch (error) {
            lastError = error;
            console.warn(`⚠️ Email attempt ${attempt}/${maxRetries} failed. Retrying...`);

            // Wait before retry (exponential backoff)
            if (attempt < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
        }
    }

    throw lastError;
};

export default sendEmail;
