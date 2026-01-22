import multer from 'multer';
import { parsePDF, generateSlug } from '../utils/pdfParser.js';
import { convertTextToCourseJSON } from '../services/aiService.js';
import Course from '../models/Course.js';
import { aiCourseOutputSchema, courseDatabaseSchema } from '../utils/validators.js';



// Multer config for PDF storage in memory
const storage = multer.memoryStorage();
export const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    },
    limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
}).single('file');

/**
 * @desc    Upload PDF and convert to Course via AI
 * @route   POST /api/admin/courses/upload
 * @access  Private/Admin
 */
export const uploadAndConvertCourse = async (req, res, next) => {
    try {
        if (!req.file) {
            console.error('❌ No file received in req.file');
            return res.status(400).json({
                success: false,
                message: 'No file uploaded. Ensure the form field name is "file".'
            });
        }

        // Phase 1: Raw Extraction
        console.log('📄 Phase 1: Extracting raw text from PDF...');
        const rawText = await parsePDF(req.file.buffer);

        // Phase 2: Semantic Chunking (AI)
        console.log('🤖 Phase 2: Converting text to structured JSON using AI...');
        const courseData = await convertTextToCourseJSON(rawText);

        // Add additional metadata
        courseData.slug = generateSlug(courseData.title);
        courseData.createdBy = req.user._id;

        // Return for preview/approval
        res.status(200).json({
            success: true,
            message: 'Course conversion successful. Please review and approve.',
            data: courseData
        });

    } catch (error) {
        console.error('Upload & Convert Error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to process course conversion'
        });
    }
};

/**
 * @desc    Save approved course to database
 * @route   POST /api/admin/courses/save
 * @access  Private/Admin
 */
export const saveApprovedCourse = async (req, res, next) => {
    try {
        // 1. Validate the incoming data (which uses AI field names)
        const validation = aiCourseOutputSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validation.error.errors
            });
        }

        const rawData = validation.data;

        // 2. Map AI field names to Database field names
        const dbReadyData = {
            title: rawData.title,
            description: rawData.description,
            category: rawData.category,
            level: rawData.level,
            modules: rawData.modules.map(module => ({
                title: module.moduleTitle,
                lessons: module.lessons.map(lesson => ({
                    title: lesson.lessonTitle,
                    content: lesson.content,
                    keyPoints: lesson.keyPoints
                }))
            })),
            quizzes: rawData.quiz || [] // Rename quiz -> quizzes
        };

        const course = new Course({
            ...dbReadyData,
            createdBy: req.user._id,
            isPublished: false
        });

        await course.save();

        res.status(201).json({
            success: true,
            message: 'Course saved successfully',
            data: course
        });
    } catch (error) {
        next(error);
    }
};
