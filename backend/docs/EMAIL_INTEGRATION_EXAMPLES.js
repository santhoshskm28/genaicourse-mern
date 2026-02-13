/**
 * Email Integration Examples
 * 
 * This file shows how to integrate email notifications
 * into your existing controllers and workflows.
 */

// ============================================
// 1. WELCOME EMAIL - On User Registration
// ============================================

// In: controllers/authController.js → register()

export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // ... existing user creation logic ...
        const user = await User.create({ name, email, password });

        // ✅ SEND WELCOME EMAIL
        const { sendEmail } = await import('../utils/email/sendEmail.js');
        const { welcomeTemplate } = await import('../utils/email/templates/welcomeTemplate.js');

        // Send asynchronously (don't block response)
        sendEmail({
            to: user.email,
            subject: 'Welcome to GENAICOURSE.IO! 🎉',
            html: welcomeTemplate(user.name)
        }).catch(err => console.error('Welcome email failed:', err));

        // Return response immediately
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: { user: user.getPublicProfile(), token }
        });
    } catch (error) {
        next(error);
    }
};

// ============================================
// 2. LOGIN ALERT EMAIL - On User Login
// ============================================

// In: controllers/authController.js → login()

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // ... existing login logic ...
        const user = await User.findOne({ email }).select('+password');
        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // ✅ SEND LOGIN ALERT EMAIL
        const { sendEmail } = await import('../utils/email/sendEmail.js');
        const { loginAlertTemplate } = await import('../utils/email/templates/loginAlertTemplate.js');

        const loginTime = new Date().toLocaleString('en-US', {
            dateStyle: 'full',
            timeStyle: 'short'
        });
        const ipAddress = req.ip || req.connection.remoteAddress || 'Unknown';
        const location = 'Unknown'; // You can use IP geolocation service here

        // Send asynchronously
        sendEmail({
            to: user.email,
            subject: '🔐 New Login Detected - GENAICOURSE.IO',
            html: loginAlertTemplate(user.name, loginTime, ipAddress, location)
        }).catch(err => console.error('Login alert email failed:', err));

        // Return response
        const token = generateToken(user._id);
        res.status(200).json({
            success: true,
            data: { user: user.getPublicProfile(), token }
        });
    } catch (error) {
        next(error);
    }
};

// ============================================
// 3. ENROLLMENT EMAIL - On Course Enrollment
// ============================================

// In: controllers/courseController.js → enrollCourse()

export const enrollCourse = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const userId = req.user._id;

        // ... existing enrollment logic ...
        const course = await Course.findById(courseId);
        const user = await User.findById(userId);

        // Add course to user's enrolled courses
        user.enrolledCourses.push({
            course: courseId,
            enrolledAt: Date.now()
        });
        await user.save();

        // ✅ SEND ENROLLMENT CONFIRMATION EMAIL
        const { sendEmail } = await import('../utils/email/sendEmail.js');
        const { enrollmentTemplate } = await import('../utils/email/templates/enrollmentTemplate.js');

        sendEmail({
            to: user.email,
            subject: '🎓 Course Enrollment Confirmed - GENAICOURSE.IO',
            html: enrollmentTemplate(
                user.name,
                course.title,
                course.description,
                course.instructor || 'GENAICOURSE Team'
            )
        }).catch(err => console.error('Enrollment email failed:', err));

        res.status(200).json({
            success: true,
            message: 'Successfully enrolled in course',
            data: { course }
        });
    } catch (error) {
        next(error);
    }
};

// ============================================
// 4. CERTIFICATE EMAIL - On Course Completion
// ============================================

// In: controllers/certificateController.js → generateCertificate()

export const generateCertificate = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const userId = req.user._id;

        // ... existing certificate generation logic ...
        const user = await User.findById(userId);
        const course = await Course.findById(courseId);

        // Generate PDF certificate (your existing logic)
        const certificatePath = await generateCertificatePDF(user, course);

        // ✅ SEND CERTIFICATE EMAIL WITH ATTACHMENT
        const { sendEmail } = await import('../utils/email/sendEmail.js');
        const { certificateTemplate } = await import('../utils/email/templates/certificateTemplate.js');

        const completionDate = new Date().toLocaleDateString('en-US', {
            dateStyle: 'long'
        });

        await sendEmail({
            to: user.email,
            subject: '🏆 Your Certificate is Ready! - GENAICOURSE.IO',
            html: certificateTemplate(user.name, course.title, completionDate),
            attachments: [
                {
                    filename: `GENAICOURSE-Certificate-${course.title.replace(/\s+/g, '-')}.pdf`,
                    path: certificatePath,
                    contentType: 'application/pdf'
                }
            ]
        });

        res.status(200).json({
            success: true,
            message: 'Certificate generated and sent',
            data: { certificatePath }
        });
    } catch (error) {
        next(error);
    }
};

// ============================================
// 5. BATCH EMAIL EXAMPLE - Send to Multiple Users
// ============================================

// Example: Send announcement to all enrolled students

export const sendCourseAnnouncement = async (req, res, next) => {
    try {
        const { courseId, subject, message } = req.body;

        // Get all enrolled students
        const course = await Course.findById(courseId).populate('enrolledStudents');

        const { sendEmail } = await import('../utils/email/sendEmail.js');

        // Create simple HTML template
        const announcementHTML = `
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>${subject}</h2>
                <p>${message}</p>
                <hr>
                <p style="color: #666; font-size: 12px;">
                    This is an announcement from ${course.title}
                </p>
            </body>
            </html>
        `;

        // Send to all students (in parallel)
        const emailPromises = course.enrolledStudents.map(student =>
            sendEmail({
                to: student.email,
                subject: `[${course.title}] ${subject}`,
                html: announcementHTML
            })
        );

        await Promise.all(emailPromises);

        res.status(200).json({
            success: true,
            message: `Announcement sent to ${course.enrolledStudents.length} students`
        });
    } catch (error) {
        next(error);
    }
};

// ============================================
// 6. ERROR HANDLING EXAMPLE
// ============================================

// Robust email sending with error handling

export const sendEmailSafely = async (emailOptions) => {
    try {
        const { sendEmailWithRetry } = await import('../utils/email/sendEmail.js');

        const result = await sendEmailWithRetry(emailOptions, 3);

        if (!result.success) {
            // Log to monitoring service (e.g., Sentry)
            console.error('Email failed after retries:', {
                to: emailOptions.to,
                subject: emailOptions.subject,
                error: result.error
            });

            // Optionally: Store failed email in database for manual retry
            await FailedEmail.create({
                to: emailOptions.to,
                subject: emailOptions.subject,
                html: emailOptions.html,
                error: result.error,
                attempts: 3
            });
        }

        return result;
    } catch (error) {
        console.error('Email sending error:', error);
        return { success: false, error: error.message };
    }
};

// ============================================
// 7. BACKGROUND JOB EXAMPLE (Optional)
// ============================================

// For high-volume applications, use a queue system like Bull

import Queue from 'bull';

const emailQueue = new Queue('email', {
    redis: {
        host: '127.0.0.1',
        port: 6379
    }
});

// Process email jobs
emailQueue.process(async (job) => {
    const { to, subject, html, attachments } = job.data;

    const { sendEmail } = await import('../utils/email/sendEmail.js');

    return await sendEmail({ to, subject, html, attachments });
});

// Add email to queue instead of sending directly
export const queueEmail = async (emailOptions) => {
    await emailQueue.add(emailOptions, {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000
        }
    });
};

// Usage in controller:
// await queueEmail({
//     to: user.email,
//     subject: 'Welcome!',
//     html: welcomeTemplate(user.name)
// });

// ============================================
// 8. EMAIL PREFERENCES EXAMPLE
// ============================================

// Check user preferences before sending

export const sendEmailWithPreferences = async (user, emailType, emailOptions) => {
    // Check if user has opted out of this email type
    if (user.emailPreferences && !user.emailPreferences[emailType]) {
        console.log(`User ${user.email} has opted out of ${emailType} emails`);
        return { success: false, reason: 'User opted out' };
    }

    const { sendEmail } = await import('../utils/email/sendEmail.js');
    return await sendEmail(emailOptions);
};

// Usage:
// await sendEmailWithPreferences(user, 'marketing', {
//     to: user.email,
//     subject: 'New Course Available',
//     html: marketingTemplate()
// });

// ============================================
// EXPORT ALL EXAMPLES
// ============================================

export default {
    register,
    login,
    enrollCourse,
    generateCertificate,
    sendCourseAnnouncement,
    sendEmailSafely,
    queueEmail,
    sendEmailWithPreferences
};
