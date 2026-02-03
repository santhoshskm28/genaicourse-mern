import Certificate from '../models/Certificate.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import UserProgress from '../models/UserProgress.js';
import { generateCertificatePDF, generateCertificateHTML } from '../services/certificateService.js';

/**
 * @desc    Generate certificate for completed course
 * @route   POST /api/certificates/generate
 * @access  Private
 */
export const generateCertificate = async (req, res, next) => {
    try {
        const { courseId } = req.body;
        const userId = req.user._id;

        // Check if certificate already exists
        const existingCertificate = await Certificate.findOne({
            userId,
            courseId
        });

        if (existingCertificate) {
            return res.status(400).json({
                success: false,
                message: 'Certificate already generated for this course'
            });
        }

        // Get user progress
        const progress = await UserProgress.findOne({ userId, courseId })
            .populate('courseId');

        if (!progress || progress.progressPercentage < 100) {
            return res.status(400).json({
                success: false,
                message: 'Course must be completed to generate certificate'
            });
        }

        // Get user and course details
        const user = await User.findById(userId);
        const course = await Course.findById(courseId);

        if (!user || !course) {
            return res.status(404).json({
                success: false,
                message: 'User or course not found'
            });
        }

        // Create certificate
        const certificate = await Certificate.create({
            userId,
            courseId,
            userName: user.name,
            courseTitle: course.title,
            completionDate: new Date(),
            totalTimeSpent: progress.totalTimeSpent,
            modulesCompleted: course.modules.length,
            totalModules: course.modules.length,
            grade: calculateGrade(progress.averageScore),
            score: progress.averageScore,
            skillsAcquired: course.learningObjectives || [],
            instructorName: course.createdBy?.name || 'Instructor',
            verificationUrl: `${process.env.CLIENT_URL}/verify-certificate/`
        });

        await certificate.populate('courseId', 'title thumbnail');
        await certificate.populate('userId', 'name email');

        res.status(201).json({
            success: true,
            message: 'Certificate generated successfully',
            data: certificate
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all certificates for a user
 * @route   GET /api/certificates
 * @access  Private
 */
export const getUserCertificates = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const certificates = await Certificate.find({
            userId: req.user._id,
            isRevoked: false
        })
            .populate('courseId', 'title thumbnail category level')
            .sort({ completionDate: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Certificate.countDocuments({
            userId: req.user._id,
            isRevoked: false
        });

        res.status(200).json({
            success: true,
            data: {
                certificates,
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
 * @desc    Get certificate by ID
 * @route   GET /api/certificates/:id
 * @access  Public (for verification)
 */
export const getCertificateById = async (req, res, next) => {
    try {
        const certificate = await Certificate.findById(req.params.id)
            .populate('userId', 'name')
            .populate('courseId', 'title description category level');

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: 'Certificate not found'
            });
        }

        // Check if user owns the certificate or it's being verified publicly
        if (certificate.userId._id.toString() !== req.user?._id?.toString()) {
            // Return limited data for public verification
            const publicData = {
                certificateId: certificate.certificateId,
                userName: certificate.userName,
                courseTitle: certificate.courseTitle,
                completionDate: certificate.completionDate,
                grade: certificate.grade,
                score: certificate.score,
                isRevoked: certificate.isRevoked,
                verificationUrl: certificate.verificationUrl
            };

            return res.status(200).json({
                success: true,
                data: publicData
            });
        }

        res.status(200).json({
            success: true,
            data: certificate
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Verify certificate by ID
 * @route   GET /api/certificates/verify/:certificateId
 * @access  Public
 */
export const verifyCertificate = async (req, res, next) => {
    try {
        const { certificateId } = req.params;

        const certificate = await Certificate.findOne({ certificateId })
            .populate('userId', 'name')
            .populate('courseId', 'title category level');

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: 'Certificate not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                isValid: !certificate.isRevoked,
                certificate: {
                    userName: certificate.userName,
                    courseTitle: certificate.courseTitle,
                    completionDate: certificate.completionDate,
                    grade: certificate.grade,
                    score: certificate.score,
                    isRevoked: certificate.isRevoked,
                    revokedReason: certificate.revokedReason,
                    verificationDate: new Date()
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Download certificate PDF
 * @route   GET /api/certificates/:id/download
 * @access  Private
 */
export const downloadCertificate = async (req, res, next) => {
    try {
        console.log(`Certificate download request for ID: ${req.params.id} by user: ${req.user._id}`);

        // Validate certificate ID format
        if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid certificate ID format'
            });
        }

        const certificate = await Certificate.findById(req.params.id)
            .populate('userId', 'name email')
            .populate('courseId', 'title description');

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: 'Certificate not found'
            });
        }

        if (certificate.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to download this certificate'
            });
        }

        if (certificate.isRevoked) {
            return res.status(400).json({
                success: false,
                message: 'Certificate has been revoked'
            });
        }

        // Prepare certificate data with validation
        const certificateData = {
            userName: certificate.userName || 'Certificate Holder',
            courseTitle: certificate.courseTitle || 'Course Completion',
            score: certificate.score || 0,
            grade: certificate.grade || 'Pass',
            completionDate: certificate.completionDate || new Date(),
            certificateId: certificate.certificateId || 'CERT-' + Date.now(),
            instructorName: certificate.instructorName || 'Course Instructor'
        };

        console.log(`Generating PDF for certificate: ${certificateData.certificateId}`);

        const pdfBuffer = await generateCertificatePDF(certificateData);

        if (!pdfBuffer || pdfBuffer.length === 0) {
            throw new Error('Generated PDF is empty or invalid');
        }

        const fileName = `certificate_${certificateData.certificateId}.pdf`;

        // Set headers for PDF download - Using res.type to avoid charset appending
        res.type('application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Length', pdfBuffer.length);
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); // Disable cache to ensure fresh PDF

        // Use res.end for binary data to prevent Express from trying to be smart with encoding
        res.end(pdfBuffer, 'binary');

        console.log(`Certificate downloaded successfully: ${certificateData.certificateId}`);
    } catch (error) {
        console.error('Certificate download error:', error);

        // Handle specific error cases
        if (error.message.includes('PDF generation service temporarily unavailable')) {
            return res.status(503).json({
                success: false,
                message: 'PDF generation service temporarily unavailable. Please try again in a few minutes.'
            });
        } else if (error.message.includes('timed out')) {
            return res.status(504).json({
                success: false,
                message: 'Certificate generation timed out. Please try again.'
            });
        } else if (error.message.includes('Invalid certificate data')) {
            return res.status(400).json({
                success: false,
                message: 'Certificate data is invalid. Please contact support.'
            });
        }

        next(error);
    }
};

/**
 * @desc    Revoke certificate (admin only)
 * @route   PUT /api/certificates/:id/revoke
 * @access  Private (Admin)
 */
export const revokeCertificate = async (req, res, next) => {
    try {
        const { reason } = req.body;

        const certificate = await Certificate.findById(req.params.id);

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: 'Certificate not found'
            });
        }

        certificate.isRevoked = true;
        certificate.revokedAt = new Date();
        certificate.revokedReason = reason || 'Revoked by administrator';

        await certificate.save();

        res.status(200).json({
            success: true,
            message: 'Certificate revoked successfully',
            data: certificate
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all certificates (admin only)
 * @route   GET /api/certificates/admin/all
 * @access  Private (Admin)
 */
export const getAllCertificates = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search, revoked } = req.query;

        const query = {};
        if (search) {
            query.$or = [
                { userName: { $regex: search, $options: 'i' } },
                { courseTitle: { $regex: search, $options: 'i' } },
                { certificateId: { $regex: search, $options: 'i' } }
            ];
        }
        if (revoked !== undefined) {
            query.isRevoked = revoked === 'true';
        }

        const certificates = await Certificate.find(query)
            .populate('userId', 'name email')
            .populate('courseId', 'title category')
            .sort({ completionDate: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Certificate.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                certificates,
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

// Helper function to calculate grade
const calculateGrade = (score) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    return 'Pass';
};

/**
 * @desc    Preview certificate HTML
 * @route   GET /api/certificates/:id/preview
 * @access  Private
 */
export const previewCertificate = async (req, res, next) => {
    try {
        const certificate = await Certificate.findById(req.params.id)
            .populate('userId', 'name email')
            .populate('courseId', 'title description');

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: 'Certificate not found'
            });
        }

        if (certificate.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to preview this certificate'
            });
        }

        if (certificate.isRevoked) {
            return res.status(400).json({
                success: false,
                message: 'Certificate has been revoked'
            });
        }

        const certificateData = {
            userName: certificate.userName,
            courseTitle: certificate.courseTitle,
            score: certificate.score,
            grade: certificate.grade,
            completionDate: certificate.completionDate,
            certificateId: certificate.certificateId,
            instructorName: certificate.instructorName || 'Course Instructor'
        };

        const html = generateCertificateHTML(certificateData);

        res.setHeader('Content-Type', 'text/html');
        res.send(html);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Share certificate (get shareable link)
 * @route   POST /api/certificates/:id/share
 * @access  Private
 */
export const shareCertificate = async (req, res, next) => {
    try {
        const certificate = await Certificate.findById(req.params.id);

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: 'Certificate not found'
            });
        }

        if (certificate.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to share this certificate'
            });
        }

        if (certificate.isRevoked) {
            return res.status(400).json({
                success: false,
                message: 'Certificate has been revoked'
            });
        }

        const shareableLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-certificate/${certificate.certificateId}`;

        res.status(200).json({
            success: true,
            data: {
                shareableLink,
                certificateId: certificate.certificateId,
                expiryDate: null // Certificates don't expire in this system
            }
        });
    } catch (error) {
        next(error);
    }
};

export default {
    generateCertificate,
    getUserCertificates,
    getCertificateById,
    verifyCertificate,
    downloadCertificate,
    revokeCertificate,
    getAllCertificates,
    previewCertificate,
    shareCertificate
};