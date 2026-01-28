import express from 'express';
import {
    generateCertificate,
    getUserCertificates,
    getCertificateById,
    verifyCertificate,
    downloadCertificate,
    revokeCertificate,
    getAllCertificates,
    previewCertificate,
    shareCertificate
} from '../controllers/certificateController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * Certificate Routes
 */

// Generate certificate
router.post('/generate', protect, generateCertificate);

// Get user certificates
router.get('/', protect, getUserCertificates);

// Get certificate by ID (both private and public access)
router.get('/:id', getCertificateById);

// Verify certificate (public endpoint)
router.get('/verify/:certificateId', verifyCertificate);

// Download certificate
router.get('/:id/download', protect, downloadCertificate);

// Revoke certificate (admin only)
router.put('/:id/revoke', protect, authorize('admin'), revokeCertificate);

// Preview certificate
router.get('/:id/preview', protect, previewCertificate);

// Share certificate
router.post('/:id/share', protect, shareCertificate);

// Get all certificates (admin only)
router.get('/admin/all', protect, authorize('admin'), getAllCertificates);

export default router;