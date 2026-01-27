import Quiz from '../models/Quiz.js';
import Course from '../models/Course.js';
import asyncHandler from 'express-async-handler';

// @desc    Upload/Import assessment from JSON
// @route   POST /api/assessments/upload
// @access  Private (Instructor/Admin only)
export const uploadAssessment = asyncHandler(async (req, res) => {
  const { assessmentData, courseId } = req.body;

  // Validate assessment data structure
  const validationResult = validateAssessmentData(assessmentData);
  if (!validationResult.isValid) {
    return res.status(400).json({
      message: 'Invalid assessment data',
      errors: validationResult.errors
    });
  }

  // Check if user is instructor/admin of the course
  if (courseId) {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Verify instructor permissions
    const isInstructor = req.user.role === 'instructor' || req.user.role === 'admin';
    const isCourseOwner = course.createdBy.toString() === req.user.id;
    const isCourseInstructor = course.instructors && course.instructors.some(inst => inst.userId.toString() === req.user.id);

    if (!isInstructor || (req.user.role === 'instructor' && !isCourseOwner && !isCourseInstructor)) {
      return res.status(403).json({ message: 'Not authorized to upload assessments for this course' });
    }
  }

  try {
    // Transform questions to match Schema
    const formattedQuestions = assessmentData.questions.map(q => {
      return {
        question: q.question,
        type: 'multiple-choice', // Default type
        options: q.options.map(opt => ({
          text: opt,
          isCorrect: opt === q.correctAnswer
        })),
        correctAnswer: q.correctAnswer,
        points: q.points || 5,
        explanation: q.explanation
      };
    });

    // Create quiz from assessment data
    const quiz = await Quiz.create({
      title: assessmentData.title,
      description: assessmentData.description,
      courseId: courseId || undefined, // Handle empty string/null
      questions: formattedQuestions,
      timeLimit: assessmentData.timeLimit || 60,
      maxAttempts: assessmentData.maxAttempts || 3,
      passingScore: assessmentData.passingScore || 80,
      shuffleQuestions: assessmentData.shuffleQuestions || false,
      showResults: assessmentData.showResults !== false,
      allowReview: assessmentData.allowReview !== false,
      isPublished: true, // Auto-publish uploaded assessments
      createdBy: req.user.id
    });

    // If courseId provided, link quiz to course
    if (courseId) {
      await Course.findByIdAndUpdate(courseId, { quizId: quiz._id });
    }

    res.status(201).json({
      message: 'Assessment uploaded successfully',
      quiz: {
        id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        questionCount: quiz.questions.length,
        timeLimit: quiz.timeLimit,
        maxAttempts: quiz.maxAttempts,
        passingScore: quiz.passingScore,
        courseId: quiz.courseId
      }
    });
  } catch (error) {
    console.error('Error uploading assessment:', error);
    res.status(500).json({ message: 'Failed to upload assessment' });
  }
});

// @desc    Get assessment template/sample
// @route   GET /api/assessments/template
// @access  Private (Instructor/Admin only)
export const getAssessmentTemplate = asyncHandler(async (req, res) => {
  console.log('Template endpoint called');
  const template = {
    title: "Sample Assessment Title",
    description: "Brief description of the assessment",
    timeLimit: 60, // minutes
    maxAttempts: 3,
    passingScore: 80, // percentage
    shuffleQuestions: false,
    showResults: true,
    allowReview: true,
    questions: [
      {
        question: "Sample question text?",
        options: [
          "Option A",
          "Option B",
          "Option C",
          "Option D"
        ],
        correctAnswer: "Option A",
        points: 5,
        explanation: "Explanation for why this answer is correct"
      }
    ]
  };

  res.json({
    message: 'Assessment template',
    template,
    instructions: {
      format: "JSON",
      requiredFields: ["title", "questions"],
      optionalFields: ["description", "timeLimit", "maxAttempts", "passingScore"],
      questionFields: ["question", "options", "correctAnswer"],
      maxQuestions: 100,
      maxOptions: 6
    }
  });
});

// @desc    Import assessment from file
// @route   POST /api/assessments/import-file
// @access  Private (Instructor/Admin only)
export const importAssessmentFromFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const { courseId } = req.body;
  const file = req.file;

  try {
    // Read file content
    let assessmentData;

    if (file.mimetype === 'application/json') {
      // JSON file
      const fileContent = Buffer.from(file.buffer).toString('utf-8');
      assessmentData = JSON.parse(fileContent);
    } else if (file.mimetype === 'text/csv') {
      // CSV file - convert to assessment format
      assessmentData = await parseCSVToAssessment(file.buffer);
    } else {
      return res.status(400).json({
        message: 'Unsupported file format. Please upload JSON or CSV files.'
      });
    }

    // Validate and create assessment
    const validationResult = validateAssessmentData(assessmentData);
    if (!validationResult.isValid) {
      return res.status(400).json({
        message: 'Invalid assessment data',
        errors: validationResult.errors
      });
    }

    // Check course permissions
    if (courseId) {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      const isInstructor = req.user.role === 'instructor' || req.user.role === 'admin';
      const isCourseOwner = course.createdBy.toString() === req.user.id;
      const isCourseInstructor = course.instructors && course.instructors.some(inst => inst.userId.toString() === req.user.id);

      if (!isInstructor || (req.user.role === 'instructor' && !isCourseOwner && !isCourseInstructor)) {
        return res.status(403).json({ message: 'Not authorized to upload assessments for this course' });
      }
    }

    // Transform questions to match Schema
    const formattedQuestions = assessmentData.questions.map(q => {
      return {
        question: q.question,
        type: 'multiple-choice', // Default type
        options: q.options.map(opt => ({
          text: opt,
          isCorrect: opt === q.correctAnswer
        })),
        correctAnswer: q.correctAnswer,
        points: q.points || 5,
        explanation: q.explanation
      };
    });

    // Create quiz
    const quiz = await Quiz.create({
      title: assessmentData.title,
      description: assessmentData.description,
      courseId: courseId || undefined,
      questions: formattedQuestions,
      timeLimit: assessmentData.timeLimit || 60,
      maxAttempts: assessmentData.maxAttempts || 3,
      passingScore: assessmentData.passingScore || 80,
      shuffleQuestions: assessmentData.shuffleQuestions || false,
      showResults: assessmentData.showResults !== false,
      allowReview: assessmentData.allowReview !== false,
      isPublished: true, // Auto-publish uploaded assessments
      createdBy: req.user.id
    });

    // Link to course if provided
    if (courseId) {
      await Course.findByIdAndUpdate(courseId, { quizId: quiz._id });
    }

    res.status(201).json({
      message: 'Assessment imported successfully',
      quiz: {
        id: quiz._id,
        title: quiz.title,
        questionCount: quiz.questions.length,
        courseId: quiz.courseId
      }
    });
  } catch (error) {
    console.error('Error importing assessment:', error);
    res.status(500).json({ message: 'Failed to import assessment' });
  }
});

// @desc    Get instructor's assessments
// @route   GET /api/assessments/instructor
// @access  Private (Instructor/Admin only)
export const getInstructorAssessments = asyncHandler(async (req, res) => {
  const quizzes = await Quiz.find({ createdBy: req.user.id })
    .populate('courseId', 'title')
    .sort({ createdAt: -1 });

  res.json({
    assessments: quizzes.map(quiz => ({
      id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      questionCount: quiz.questions.length,
      timeLimit: quiz.timeLimit,
      maxAttempts: quiz.maxAttempts,
      passingScore: quiz.passingScore,
      courseId: quiz.courseId?._id,
      courseTitle: quiz.courseId?.title,
      createdAt: quiz.createdAt,
      isActive: quiz.isActive
    }))
  });
});

// @desc    Update assessment
// @route   PUT /api/assessments/:id
// @access  Private (Instructor/Admin only)
export const updateAssessment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const quiz = await Quiz.findById(id);
  if (!quiz) {
    return res.status(404).json({ message: 'Assessment not found' });
  }

  // Check permissions
  if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to update this assessment' });
  }

  // Validate updates if questions are being updated
  if (updates.questions) {
    const validationResult = validateAssessmentData({
      ...quiz.toObject(),
      ...updates
    });
    if (!validationResult.isValid) {
      return res.status(400).json({
        message: 'Invalid assessment data',
        errors: validationResult.errors
      });
    }
  }

  const updatedQuiz = await Quiz.findByIdAndUpdate(id, updates, { new: true });

  res.json({
    message: 'Assessment updated successfully',
    quiz: updatedQuiz
  });
});

// @desc    Delete assessment
// @route   DELETE /api/assessments/:id
// @access  Private (Instructor/Admin only)
export const deleteAssessment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const quiz = await Quiz.findById(id);
  if (!quiz) {
    return res.status(404).json({ message: 'Assessment not found' });
  }

  // Check permissions
  if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to delete this assessment' });
  }

  await Quiz.findByIdAndDelete(id);

  // Remove quiz reference from course if exists
  if (quiz.courseId) {
    await Course.findByIdAndUpdate(quiz.courseId, { $unset: { quizId: 1 } });
  }

  res.json({ message: 'Assessment deleted successfully' });
});

// Helper function to validate assessment data
function validateAssessmentData(data) {
  const errors = [];

  // Required fields
  if (!data.title || typeof data.title !== 'string') {
    errors.push('Title is required and must be a string');
  }

  if (!data.questions || !Array.isArray(data.questions)) {
    errors.push('Questions array is required');
  } else {
    if (data.questions.length === 0) {
      errors.push('At least one question is required');
    } else if (data.questions.length > 100) {
      errors.push('Maximum 100 questions allowed');
    }

    // Validate each question
    data.questions.forEach((question, index) => {
      if (!question.question || typeof question.question !== 'string') {
        errors.push(`Question ${index + 1}: Question text is required`);
      }

      if (!question.options || !Array.isArray(question.options)) {
        errors.push(`Question ${index + 1}: Options array is required`);
      } else {
        if (question.options.length < 2) {
          errors.push(`Question ${index + 1}: At least 2 options required`);
        } else if (question.options.length > 6) {
          errors.push(`Question ${index + 1}: Maximum 6 options allowed`);
        }

        // Check if correct answer is in options
        if (question.correctAnswer && !question.options.includes(question.correctAnswer)) {
          errors.push(`Question ${index + 1}: Correct answer must be one of the options`);
        }
      }

      if (!question.correctAnswer) {
        errors.push(`Question ${index + 1}: Correct answer is required`);
      }

      if (question.points && (typeof question.points !== 'number' || question.points < 0)) {
        errors.push(`Question ${index + 1}: Points must be a positive number`);
      }
    });
  }

  // Optional fields validation
  if (data.timeLimit && (typeof data.timeLimit !== 'number' || data.timeLimit < 1 || data.timeLimit > 180)) {
    errors.push('Time limit must be between 1 and 180 minutes');
  }

  if (data.maxAttempts && (typeof data.maxAttempts !== 'number' || data.maxAttempts < 1 || data.maxAttempts > 10)) {
    errors.push('Max attempts must be between 1 and 10');
  }

  if (data.passingScore && (typeof data.passingScore !== 'number' || data.passingScore < 0 || data.passingScore > 100)) {
    errors.push('Passing score must be between 0 and 100');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Helper function to parse CSV to assessment format
async function parseCSVToAssessment(csvBuffer) {
  const csvString = csvBuffer.toString('utf-8');
  const lines = csvString.split('\n').filter(line => line.trim());

  if (lines.length < 2) {
    throw new Error('CSV must have at least a header and one question row');
  }

  const questions = [];

  for (let i = 1; i < lines.length; i++) {
    const columns = lines[i].split(',').map(col => col.trim().replace(/"/g, ''));

    if (columns.length >= 5) {
      const [question, option1, option2, option3, option4, correctAnswer, points, explanation] = columns;

      questions.push({
        question: question || `Question ${i}`,
        options: [option1, option2, option3, option4].filter(opt => opt),
        correctAnswer: correctAnswer || option1,
        points: parseInt(points) || 5,
        explanation: explanation || ''
      });
    }
  }

  return {
    title: 'Imported Assessment',
    description: 'Assessment imported from CSV file',
    questions
  };
}