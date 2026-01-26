import express from 'express';
import multer from 'multer';
import { protect, authorize } from '../middleware/auth.js';
import {
  uploadAssessment,
  importAssessmentFromFile,
  getAssessmentTemplate,
  getInstructorAssessments,
  updateAssessment,
  deleteAssessment
} from '../controllers/assessmentUploadController.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/json', 'text/csv', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JSON and CSV files are allowed'), false);
    }
  }
});

// All routes require instructor/admin role
router.use(protect);
router.use(authorize('instructor', 'admin'));

// @route   POST /api/assessments/upload
// @desc    Upload assessment from JSON data
// @access  Private (Instructor/Admin only)
router.post('/upload', uploadAssessment);

// @route   POST /api/assessments/import-file
// @desc    Import assessment from file (JSON/CSV)
// @access  Private (Instructor/Admin only)
router.post('/import-file', upload.single('assessmentFile'), importAssessmentFromFile);

// @route   GET /api/assessments/template
// @desc    Get assessment template/sample
// @access  Private (Instructor/Admin only)
router.get('/template', getAssessmentTemplate);

// @route   GET /api/assessments/instructor
// @desc    Get instructor's assessments
// @access  Private (Instructor/Admin only)
router.get('/instructor', getInstructorAssessments);

// @route   PUT /api/assessments/:id
// @desc    Update assessment
// @access  Private (Instructor/Admin only)
router.put('/:id', updateAssessment);

// @route   DELETE /api/assessments/:id
// @desc    Delete assessment
// @access  Private (Instructor/Admin only)
router.delete('/:id', deleteAssessment);

export default router;