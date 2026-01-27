import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, Award, AlertCircle, RefreshCw, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import assessmentService from '../../services/assessmentService.js';
import certificateService from '../../services/certificateService.js';
import courseService from '../../services/courseService.js';
import { toast } from 'react-toastify';

const AssessmentCenter = () => {
  const { id: courseId } = useParams(); // changed from courseId to id to match App.jsx route param if needed, but route says :id? No, usually it's best to match. Let's assume route will be /courses/:id/assessment
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAssessment();
  }, [courseId]);

  useEffect(() => {
    if (timeRemaining > 0 && !showResults) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !showResults) {
      handleSubmit();
    }
  }, [timeRemaining, showResults]);

const loadAssessment = async () => {
    try {
      setLoading(true);
      
      // Check course completion first
      const completionStatus = await courseService.checkCourseCompletion(courseId);
      if (!completionStatus.data.allLessonsCompleted) {
        setError('Please complete all lessons before taking the assessment.');
        return;
      }
      
      const data = await assessmentService.getAssessment(courseId);
      setAssessment(data);
      setTimeRemaining(data.timeLimit * 60); // Convert minutes to seconds
      setAnswers(new Array(data.questions.length).fill(null));
    } catch (err) {
      setError(err.message || 'Failed to load assessment');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex, answer) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < assessment.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (answers.includes(null)) {
      if (!window.confirm("You haven't answered all questions. Are you sure you want to submit?")) {
        return;
      }
    }

    try {
      setSubmitting(true);
      const timeSpent = assessment.timeLimit * 60 - timeRemaining;
      const result = await assessmentService.submitAssessment(courseId, {
        answers,
        timeSpent
      });

      setResults(result);
      setShowResults(true);
    } catch (err) {
      setError(err.message || 'Failed to submit assessment');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((currentQuestion + 1) / assessment.questions.length) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (error && !assessment) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-slate-800 rounded-2xl border border-slate-700">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium transition-colors"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  if (showResults && results) {
    return <AssessmentResults results={results} courseId={courseId} />;
  }

  const question = assessment.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-slate-700">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage()}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-2">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">{assessment.title}</h1>
              <p className="text-slate-400 text-sm flex items-center gap-2">
                <HelpCircle className="w-3 h-3" />
                Question {currentQuestion + 1} of {assessment.questions.length}
              </p>
            </div>
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl border ${timeRemaining < 300
                ? 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse'
                : 'bg-slate-700/50 text-indigo-400 border-indigo-500/20'
              }`}>
              <Clock className="h-5 w-5" />
              <span className="font-mono font-bold text-lg">{formatTime(timeRemaining)}</span>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-8 mb-8"
          >
            <div className="mb-8">
              <h2 className="text-xl md:text-2xl font-semibold text-white leading-relaxed">
                {question.question}
              </h2>
              {question.points && (
                <span className="inline-block mt-3 px-3 py-1 bg-slate-700 rounded-lg text-xs font-medium text-slate-300">
                  {question.points} Points
                </span>
              )}
            </div>

            {/* Options */}
            <div className="space-y-4">
              {question.options.map((option, index) => (
                <label
                  key={index}
                  className={`group flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${answers[currentQuestion] === option
                      ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.15)]'
                      : 'border-slate-700 bg-slate-800/50 hover:bg-slate-700 hover:border-slate-600'
                    }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-colors ${answers[currentQuestion] === option
                      ? 'border-indigo-500 bg-indigo-500'
                      : 'border-slate-500 group-hover:border-slate-400'
                    }`}>
                    {answers[currentQuestion] === option && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={option}
                    checked={answers[currentQuestion] === option}
                    onChange={() => handleAnswerChange(currentQuestion, option)}
                    className="hidden"
                  />
                  <span className={`text-lg ${answers[currentQuestion] === option ? 'text-white font-medium' : 'text-slate-300 group-hover:text-white'
                    }`}>
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Footer Navigation */}
        <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-xl backdrop-blur-sm border border-slate-700/50">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6 py-2.5 rounded-lg border border-slate-600 text-slate-300 font-medium hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <div className="flex gap-1.5 overflow-x-auto max-w-[200px] md:max-w-md px-2 scrollbar-none">
            {assessment.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentQuestion
                    ? 'bg-indigo-500 w-6'
                    : answers[index] !== null
                      ? 'bg-emerald-500/50 hover:bg-emerald-500'
                      : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                title={`Question ${index + 1}`}
              />
            ))}
          </div>

          {currentQuestion === assessment.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 font-bold shadow-lg shadow-indigo-900/20 transition-all hover:scale-105"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit
                  <CheckCircle className="w-4 h-4" />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors flex items-center gap-2"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const AssessmentResults = ({ results, courseId }) => {
  const navigate = useNavigate();
  const [downloadingCert, setDownloadingCert] = useState(false);

const handleDownloadCertificate = async () => {
    try {
      setDownloadingCert(true);
      await certificateService.downloadCertificate(results.certificate.id);
      toast.success('Certificate downloaded successfully!');
    } catch (error) {
      console.error('Failed to download certificate:', error);
      toast.error('Failed to download certificate');
    } finally {
      setDownloadingCert(false);
    }
  };

const handleRetakeAssessment = async () => {
    try {
      setLoading(true);
      // Reset state and reload assessment
      setShowResults(false);
      setResults(null);
      setCurrentQuestion(0);
      setAnswers([]);
      await loadAssessment();
      toast.info('Assessment reset. Good luck!');
    } catch (error) {
      toast.error('Failed to retake assessment');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Result Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden mb-8"
        >
          <div className={`p-10 text-center relative overflow-hidden ${results.attempt.passed ? 'bg-emerald-900/20' : 'bg-red-900/20'
            }`}>
            <div className={`absolute inset-0 opacity-10 ${results.attempt.passed
                ? 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500 via-transparent'
                : 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500 via-transparent'
              }`}></div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${results.attempt.passed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-500'
                }`}
            >
              {results.attempt.passed ? (
                <Award className="w-12 h-12" />
              ) : (
                <XCircle className="w-12 h-12" />
              )}
            </motion.div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {results.attempt.passed ? 'Assessment Passed!' : 'Assessment Failed'}
            </h1>

            <p className="text-slate-400 max-w-lg mx-auto text-lg">
              {results.attempt.passed
                ? 'Congratulations! You have demonstrated mastery of the course material.'
                : 'Don\'t give up! Review the course materials and try again to earn your certificate.'
              }
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 divide-x divide-slate-700 border-t border-slate-700 bg-slate-800/50">
            <div className="p-6 text-center">
              <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Score</div>
              <div className="text-3xl font-bold text-white">{results.attempt.score}</div>
              <div className="text-xs text-slate-500">of {results.attempt.totalPoints} points</div>
            </div>
            <div className="p-6 text-center">
              <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Result</div>
              <div className={`text-3xl font-bold ${results.attempt.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                {results.attempt.percentageScore}%
              </div>
              <div className="text-xs text-slate-500">min 80% to pass</div>
            </div>
            <div className="p-6 text-center">
              <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Grade</div>
              <div className={`text-3xl font-bold ${results.attempt.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                {results.attempt.grade}
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="p-8 border-t border-slate-700 flex flex-col sm:flex-row gap-4 justify-center">
            {results.attempt.passed && results.certificate ? (
              <button
                onClick={handleDownloadCertificate}
                disabled={downloadingCert}
                className="btn btn-primary bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20 px-8 py-3 rounded-xl flex items-center justify-center gap-2"
              >
                {downloadingCert ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Award className="w-5 h-5" />
                    Download Certificate
                  </>
                )}
              </button>
            ) : null}

{!results.attempt.passed && (
              <button
                onClick={handleRetakeAssessment}
                className="btn bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
            )}

            <button
              onClick={() => navigate(`/courses/${courseId}`)}
              className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-xl font-medium transition-colors border border-slate-600"
            >
              Return to Course
            </button>
          </div>
        </motion.div>

        {/* Question Review */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white mb-4 ml-2">Question Review</h3>
          {results.attempt.results.map((result, index) => (
            <div
              key={index}
              className={`p-5 rounded-xl border ${result.isCorrect
                  ? 'bg-emerald-500/5 border-emerald-500/20'
                  : 'bg-red-500/5 border-red-500/20'
                }`}
            >
              <div className="flex gap-4">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${result.isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                  {result.isCorrect ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium mb-3">{index + 1}. {result.question}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                      <span className="text-slate-400 block mb-1 text-xs">Your Answer</span>
                      <span className={result.isCorrect ? 'text-emerald-400' : 'text-red-400'}>
                        {result.userAnswer}
                      </span>
                    </div>
                    {!result.isCorrect && (
                      <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                        <span className="text-slate-400 block mb-1 text-xs">Correct Answer</span>
                        <span className="text-emerald-400">
                          {result.correctAnswer}
                        </span>
                      </div>
                    )}
                  </div>

                  {result.explanation && !result.isCorrect && (
                    <div className="mt-3 text-slate-400 text-sm italic border-l-2 border-slate-600 pl-3">
                      {result.explanation}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssessmentCenter;