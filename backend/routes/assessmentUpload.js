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

// Add a simple auth test route
router.get('/auth-test', protect, (req, res) => {
  res.json({
    message: 'Authentication test',
    user: req.user,
    isAuthenticated: true
  });
});

// All routes require instructor/admin role
router.use(protect);
router.use(authorize('instructor', 'admin'));

// @route   GET /api/assessments/template
router.get('/template', getAssessmentTemplate);

// @route   POST /api/assessments/upload
router.post('/upload', uploadAssessment);

// @route   POST /api/assessments/import-file
router.post('/import-file', upload.single('assessmentFile'), importAssessmentFromFile);

// @route   GET /api/assessments/instructor
router.get('/instructor', getInstructorAssessments);

// @route   PUT /api/assessments/:id
router.put('/:id', updateAssessment);

// @route   DELETE /api/assessments/:id
router.delete('/:id', deleteAssessment);



export default router;