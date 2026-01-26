import Quiz from '../models/Quiz.js';
import UserQuizAttempt from '../models/UserQuizAttempt.js';
import UserProgress from '../models/UserProgress.js';
import Course from '../models/Course.js';
import Certificate from '../models/Certificate.js';
import { generateCertificatePDF } from '../services/certificateService.js';
import asyncHandler from 'express-async-handler';

// @desc    Take course assessment
// @route   POST /api/assessments/:courseId/take
// @access  Private (Student only)
export const takeAssessment = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { answers, timeSpent } = req.body;
  const userId = req.user.id;

  // Get course and quiz
  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  const quiz = await Quiz.findById(course.quizId);
  if (!quiz) {
    return res.status(404).json({ message: 'Assessment not found for this course' });
  }

  // Check if user is enrolled
  const userProgress = await UserProgress.findOne({ userId, courseId });
  if (!userProgress) {
    return res.status(403).json({ message: 'You must be enrolled in this course to take the assessment' });
  }

  // Check if course is completed (all lessons done)
  if (userProgress.lessonsCompleted < course.lessons.length) {
    return res.status(400).json({ 
      message: 'You must complete all lessons before taking the assessment',
      lessonsCompleted: userProgress.lessonsCompleted,
      totalLessons: course.lessons.length
    });
  }

  // Check previous attempts
  const previousAttempts = await UserQuizAttempt.find({ 
    userId, 
    quizId: quiz._id 
  }).sort({ createdAt: -1 });

  if (previousAttempts.length >= quiz.maxAttempts) {
    return res.status(400).json({ 
      message: `Maximum attempts (${quiz.maxAttempts}) reached`,
      attempts: previousAttempts.length
    });
  }

  // Calculate score
  let score = 0;
  let correctAnswers = 0;
  const results = [];

  quiz.questions.forEach((question, index) => {
    const userAnswer = answers[index];
    const isCorrect = Array.isArray(question.correctAnswer) 
      ? JSON.stringify(userAnswer.sort()) === JSON.stringify(question.correctAnswer.sort())
      : userAnswer === question.correctAnswer;

    if (isCorrect) {
      score += question.points || 1;
      correctAnswers++;
    }

    results.push({
      questionId: question._id,
      question: question.question,
      userAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect,
      points: question.points || 1,
      explanation: question.explanation
    });
  });

  const totalPoints = quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0);
  const percentageScore = Math.round((score / totalPoints) * 100);

  // Determine pass/fail (80% required)
  const passed = percentageScore >= 80;
  const grade = passed ? getGrade(percentageScore) : 'Fail';

  // Save attempt
  const attempt = await UserQuizAttempt.create({
    userId,
    quizId: quiz._id,
    courseId,
    answers,
    score,
    totalPoints,
    percentageScore,
    passed,
    grade,
    timeSpent,
    attemptNumber: previousAttempts.length + 1,
    results
  });

  // Update user progress
  userProgress.quizAttempts.push(attempt._id);
  userProgress.lastQuizScore = percentageScore;
  userProgress.quizPassed = passed;
  
  if (passed) {
    userProgress.completed = true;
    userProgress.completedAt = new Date();
    
    // Generate certificate
    const certificate = await generateCertificate(userId, courseId, percentageScore, grade);
    userProgress.certificateId = certificate._id;
  }

  await userProgress.save();

  // Update user stats
  const user = req.user;
  if (passed) {
    user.coursesCompleted += 1;
    user.certificatesEarned += 1;
    user.averageScore = ((user.averageScore * (user.coursesCompleted - 1)) + percentageScore) / user.coursesCompleted;
  }
  await user.save();

  res.json({
    message: passed ? 'Congratulations! You passed the assessment.' : 'You did not pass. Please try again.',
    attempt: {
      id: attempt._id,
      score,
      totalPoints,
      percentageScore,
      passed,
      grade,
      attemptNumber: attempt.attemptNumber,
      results,
      timeSpent,
      createdAt: attempt.createdAt
    },
    certificate: passed ? {
      id: userProgress.certificateId,
      downloadUrl: `/api/certificates/${userProgress.certificateId}/download`
    } : null,
    nextAttemptAvailable: previousAttempts.length < quiz.maxAttempts - 1,
    attemptsRemaining: quiz.maxAttempts - (previousAttempts.length + 1)
  });
});

// @desc    Get assessment results and feedback
// @route   GET /api/assessments/:courseId/results/:attemptId
// @access  Private
export const getAssessmentResults = asyncHandler(async (req, res) => {
  const { courseId, attemptId } = req.params;
  const userId = req.user.id;

  const attempt = await UserQuizAttempt.findOne({
    _id: attemptId,
    userId,
    courseId
  }).populate('quizId', 'title passingScore maxAttempts');

  if (!attempt) {
    return res.status(404).json({ message: 'Assessment attempt not found' });
  }

  res.json({
    attempt: {
      id: attempt._id,
      score: attempt.score,
      totalPoints: attempt.totalPoints,
      percentageScore: attempt.percentageScore,
      passed: attempt.passed,
      grade: attempt.grade,
      attemptNumber: attempt.attemptNumber,
      timeSpent: attempt.timeSpent,
      createdAt: attempt.createdAt,
      results: attempt.results
    },
    quiz: {
      title: attempt.quizId.title,
      passingScore: attempt.quizId.passingScore,
      maxAttempts: attempt.quizId.maxAttempts
    }
  });
});

// @desc    Get user's assessment history for a course
// @route   GET /api/assessments/:courseId/history
// @access  Private
export const getAssessmentHistory = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  const attempts = await UserQuizAttempt.find({ userId, courseId })
    .sort({ createdAt: -1 })
    .select('score percentageScore passed grade attemptNumber createdAt timeSpent');

  const userProgress = await UserProgress.findOne({ userId, courseId })
    .select('completed completedAt certificateId');

  res.json({
    attempts,
    courseCompleted: userProgress?.completed || false,
    completedAt: userProgress?.completedAt,
    hasCertificate: !!userProgress?.certificateId,
    certificateId: userProgress?.certificateId
  });
});

// Helper function to determine grade
function getGrade(score) {
  if (score >= 95) return 'A+';
  if (score >= 90) return 'A';
  if (score >= 85) return 'B+';
  if (score >= 80) return 'B';
  if (score >= 75) return 'C+';
  if (score >= 70) return 'C';
  return 'Pass';
}

// Helper function to generate certificate
async function generateCertificate(userId, courseId, score, grade) {
  const user = await User.findById(userId).select('name email');
  const course = await Course.findById(courseId).select('title description instructor');
  
  const certificateData = {
    userId,
    courseId,
    userName: user.name,
    userEmail: user.email,
    courseTitle: course.title,
    courseDescription: course.description,
    instructorName: course.instructor,
    score,
    grade,
    completionDate: new Date(),
    certificateId: `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  };

  const certificate = await Certificate.create(certificateData);
  
  // Generate PDF certificate
  const pdfBuffer = await generateCertificatePDF(certificateData);
  
  // Save PDF (you could save to cloud storage here)
  certificate.certificateUrl = `/api/certificates/${certificate._id}/download`;
  await certificate.save();

  return certificate;
}