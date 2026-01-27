import Quiz from '../models/Quiz.js';
import UserQuizAttempt from '../models/UserQuizAttempt.js';
import UserProgress from '../models/UserProgress.js';
import Course from '../models/Course.js';
import Certificate from '../models/Certificate.js';
import User from '../models/User.js';
import { generateCertificatePDF } from '../services/certificateService.js';
import asyncHandler from 'express-async-handler';

// @desc    Get assessment details for a course (for taking the quiz)
// @route   GET /api/assessments/:courseId/quiz
// @access  Private (Student only)
export const getAssessmentForCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  if (!course.quizId) {
    return res.status(404).json({ message: 'Assessment not found for this course' });
  }

  const quiz = await Quiz.findById(course.quizId);
  if (!quiz) {
    return res.status(404).json({ message: 'Assessment not found' });
  }

  // Check if quiz is published OR if the course is published (assuming linked quiz should be available)
  if (!quiz.isPublished && !course.isPublished) {
    return res.status(403).json({ message: 'Assessment is not published yet' });
  }

  // Filter out correct answers for students
  const quizForStudent = {
    _id: quiz._id,
    title: quiz.title,
    description: quiz.description,
    timeLimit: quiz.timeLimit,
    maxAttempts: quiz.maxAttempts,
    passingScore: quiz.passingScore,
    questions: quiz.questions.map(q => ({
      _id: q._id,
      question: q.question,
      options: q.options.map(opt => opt.text),
      points: q.points,
      type: q.type
    }))
  };

  res.json(quizForStudent);
});

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
  const completedLessonsCount = userProgress.completedLessons ? userProgress.completedLessons.length : 0;

  // Calculate total lessons from modules since course.lessons doesn't exist at top level
  const totalLessonsCount = course.modules ? course.modules.reduce((acc, module) => acc + (module.lessons ? module.lessons.length : 0), 0) : 0;

  console.log(`Assessment submission debug: userId=${userId}, courseId=${courseId}, completed=${completedLessonsCount}, total=${totalLessonsCount}`);

  if (completedLessonsCount < totalLessonsCount) {
    console.log('Assessment blocked: Incomplete lessons');
    return res.status(400).json({
      message: 'You must complete all lessons before taking the assessment',
      lessonsCompleted: completedLessonsCount,
      totalLessons: totalLessonsCount
    });
  }

  // Check previous attempts
  const previousAttempts = await UserQuizAttempt.find({
    userId,
    quizId: quiz._id
  }).sort({ createdAt: -1 });

  console.log(`Assessment debug: Previous attempts=${previousAttempts.length}, Max allowed=${quiz.maxAttempts}`);

  if (previousAttempts.length >= quiz.maxAttempts) {
    console.log('Assessment blocked: Max attempts reached');
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

    // Determine the correct answer(s)
    let correctAnswers_list = [];
    if (question.correctAnswer) {
      correctAnswers_list = Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer];
    } else if (question.options && question.options.length > 0) {
      correctAnswers_list = question.options.filter(opt => opt.isCorrect).map(opt => opt.text);
    }

    const isCorrect = Array.isArray(userAnswer)
      ? (Array.isArray(correctAnswers_list) &&
        userAnswer.length === correctAnswers_list.length &&
        [...userAnswer].sort().every((val, i) => val === [...correctAnswers_list].sort()[i]))
      : (correctAnswers_list.includes(userAnswer));

    if (isCorrect) {
      score += question.points || 1;
      correctAnswers++;
    }

    results.push({
      questionId: question._id,
      question: question.question,
      userAnswer,
      correctAnswer: correctAnswers_list.length === 1 ? correctAnswers_list[0] : correctAnswers_list,
      isCorrect,
      points: question.points || 1,
      explanation: question.explanation
    });
  });

  const totalPoints = quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0);
  let percentageScore = 0;

  if (totalPoints > 0) {
    percentageScore = Math.round((score / totalPoints) * 100);
  }

  console.log(`Assessment debug: Score=${score}, TotalPoints=${totalPoints}, Percentage=${percentageScore}`);

  // Determine pass/fail (80% required)
  const passed = percentageScore >= 80;
  const grade = passed ? getGrade(percentageScore) : 'Fail';

  // Prepare answers in the correct format for UserQuizAttempt model (already calculated in loop)
  const formattedAnswers = results.map((res, index) => {
    return {
      questionIndex: index,
      userAnswer: res.userAnswer,
      isCorrect: res.isCorrect,
      pointsEarned: res.isCorrect ? res.points : 0,
      timeSpent: 0
    };
  });

  const timeStarted = new Date();
  const timeCompleted = new Date();
  const duration = timeSpent || 0; // timeSpent should be in seconds

  // Save attempt with correct schema
  const attempt = await UserQuizAttempt.create({
    userId,
    quizId: quiz._id,
    attemptNumber: previousAttempts.length + 1,
    answers: formattedAnswers,
    score: percentageScore, // Model expects percentage (0-100)
    totalPoints,
    passed,
    timeStarted,
    timeCompleted,
    duration
  });

  // Update user progress using the model methods
  userProgress.completeQuiz(quiz._id, attempt._id, percentageScore, passed);

  if (passed) {
    // Check if certificate already exists to avoid duplicate key error (400)
    let certificate = await Certificate.findOne({ userId, courseId });

    if (!certificate) {
      console.log('Generating new certificate...');
      certificate = await generateCertificate(userId, courseId, percentageScore, grade);
    } else {
      console.log('User already has a certificate, updating it...');
      certificate.score = percentageScore;
      certificate.grade = grade;
      certificate.completionDate = new Date();
      await certificate.save();
    }

    userProgress.certificate = certificate._id;
    userProgress.completedAt = new Date();
  }

  await userProgress.save();

  // Update user stats - need to fetch fresh user data
  const user = await User.findById(userId);
  if (passed) {
    user.stats.coursesCompleted += 1;
    user.stats.certificatesEarned += 1;
    user.stats.averageScore = ((user.stats.averageScore * (user.stats.coursesCompleted - 1)) + percentageScore) / user.stats.coursesCompleted;
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
      id: userProgress.certificate,
      downloadUrl: `/api/certificates/${userProgress.certificate}/download`
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
    .select('completedAt certificate');

  res.json({
    attempts,
    courseCompleted: userProgress?.certificate ? true : false, // Check if certificate exists as completion indicator
    completedAt: userProgress?.completedAt,
    hasCertificate: !!userProgress?.certificate,
    certificateId: userProgress?.certificate
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