import Quiz from '../models/Quiz.js';
import Course from '../models/Course.js';
import asyncHandler from 'express-async-handler';

// @desc    Get course assessment details
// @route   GET /api/courses/:courseId/assessment
// @access  Private (Instructor/Admin only)
export const getCourseAssessment = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  // Check permissions
  const isInstructor = req.user.role === 'instructor' || req.user.role === 'admin';
  const isCourseInstructor = course.instructor.toString() === req.user.id;
  
  if (!isInstructor || (req.user.role === 'instructor' && !isCourseInstructor)) {
    return res.status(403).json({ message: 'Not authorized to view this course assessment' });
  }

  if (!course.quizId) {
    return res.json({ 
      message: 'No assessment found for this course',
      hasAssessment: false 
    });
  }

  const quiz = await Quiz.findById(course.quizId).select('title description timeLimit maxAttempts passingScore questions createdAt');
  
  if (!quiz) {
    return res.json({ 
      message: 'Assessment not found',
      hasAssessment: false 
    });
  }

  res.json({
    hasAssessment: true,
    assessment: {
      id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      questionCount: quiz.questions.length,
      timeLimit: quiz.timeLimit,
      maxAttempts: quiz.maxAttempts,
      passingScore: quiz.passingScore,
      createdAt: quiz.createdAt
    }
  });
});

// @desc    Remove assessment from course
// @route   DELETE /api/courses/:courseId/assessment
// @access  Private (Instructor/Admin only)
export const removeCourseAssessment = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  // Check permissions
  const isInstructor = req.user.role === 'instructor' || req.user.role === 'admin';
  const isCourseInstructor = course.instructor.toString() === req.user.id;
  
  if (!isInstructor || (req.user.role === 'instructor' && !isCourseInstructor)) {
    return res.status(403).json({ message: 'Not authorized to modify this course' });
  }

  if (!course.quizId) {
    return res.status(404).json({ message: 'No assessment found for this course' });
  }

  // Remove quiz reference from course
  await Course.findByIdAndUpdate(courseId, { $unset: { quizId: 1 } });

  // Optionally delete the quiz itself (comment out if you want to keep it)
  // await Quiz.findByIdAndDelete(course.quizId);

  res.json({ 
    message: 'Assessment removed from course successfully',
    courseId: courseId
  });
});

// @desc    Update course assessment settings
// @route   PUT /api/courses/:courseId/assessment
// @access  Private (Instructor/Admin only)
export const updateCourseAssessment = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { timeLimit, maxAttempts, passingScore, isActive } = req.body;

  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  // Check permissions
  const isInstructor = req.user.role === 'instructor' || req.user.role === 'admin';
  const isCourseInstructor = course.instructor.toString() === req.user.id;
  
  if (!isInstructor || (req.user.role === 'instructor' && !isCourseInstructor)) {
    return res.status(403).json({ message: 'Not authorized to modify this course' });
  }

  if (!course.quizId) {
    return res.status(404).json({ message: 'No assessment found for this course' });
  }

  // Update quiz settings
  const updateData = {};
  if (timeLimit !== undefined) updateData.timeLimit = timeLimit;
  if (maxAttempts !== undefined) updateData.maxAttempts = maxAttempts;
  if (passingScore !== undefined) updateData.passingScore = passingScore;
  if (isActive !== undefined) updateData.isActive = isActive;

  const updatedQuiz = await Quiz.findByIdAndUpdate(
    course.quizId, 
    updateData, 
    { new: true }
  );

  res.json({
    message: 'Assessment settings updated successfully',
    assessment: {
      id: updatedQuiz._id,
      title: updatedQuiz.title,
      timeLimit: updatedQuiz.timeLimit,
      maxAttempts: updatedQuiz.maxAttempts,
      passingScore: updatedQuiz.passingScore,
      isActive: updatedQuiz.isActive
    }
  });
});