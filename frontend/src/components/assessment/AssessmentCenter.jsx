import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, Award, AlertCircle, RefreshCw, ChevronLeft, ChevronRight, HelpCircle, ArrowRight, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import assessmentService from '../../services/assessmentService.js';
import certificateService from '../../services/certificateService.js';
import courseService from '../../services/courseService.js';
import { toast } from 'react-toastify';

const AssessmentCenter = ({ isEmbedded = false, courseId: propCourseId }) => {
  const { id: paramCourseId, courseId: routeCourseId } = useParams();
  const courseId = propCourseId || paramCourseId || routeCourseId;
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
      setError('');

      const completionStatus = await courseService.checkCourseCompletion(courseId);
      if (!completionStatus?.data?.allLessonsCompleted) {
        setError('Please complete all lessons before taking the assessment.');
        return;
      }

      const data = await assessmentService.getAssessment(courseId);
      setAssessment(data);
      setTimeRemaining(data.timeLimit * 60);
      setAnswers(new Array(data.questions.length).fill(null));
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to load assessment';
      setError(msg);
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
      console.error('Assessment submission error:', err);
      setError(err.response?.data?.message || 'Failed to submit assessment');
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
      <div className={`${isEmbedded ? '' : 'min-h-screen'} bg-[var(--bg-main)] flex items-center justify-center p-12`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6 shadow-xl"></div>
          <p className="text-gray-500 font-bold tracking-widest uppercase text-xs">Initializing GENAICOURSE Assessment...</p>
        </motion.div>
      </div>
    );
  }

  if (error && !assessment) {
    return (
      <div className={`${isEmbedded ? '' : 'min-h-screen'} bg-[var(--bg-main)] flex items-center justify-center p-6`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card max-w-md w-full p-10 text-center bg-white border border-gray-200 shadow-xl rounded-2xl"
        >
          <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-200">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-3xl font-black text-brand mb-4">Access Restricted</h2>
          <p className="text-gray-500 mb-8 font-medium leading-relaxed">{error}</p>
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="btn-premium btn-primary w-full"
          >
            Return to Course
          </button>
        </motion.div>
      </div>
    );
  }

  if (showResults && results) {
    return (
      <AssessmentResults
        results={results}
        courseId={courseId}
        isEmbedded={isEmbedded}
        onRetake={() => {
          setShowResults(false);
          setResults(null);
          setCurrentQuestion(0);
          setAnswers([]);
          setError('');
          loadAssessment();
        }}
      />
    );
  }

  const question = assessment.questions[currentQuestion];

  return (
    <div className={`${isEmbedded ? 'py-10' : 'min-h-screen bg-[var(--bg-main)] py-24'} px-4 sm:px-6`}>
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 mb-10 group bg-white border border-gray-200 shadow-sm rounded-2xl"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-indigo-100">Active Session</span>
                <h1 className="text-2xl font-black text-brand">{assessment.title}</h1>
              </div>
              <div className="flex items-center gap-4 text-gray-500 font-bold text-xs uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><HelpCircle size={14} />Question {currentQuestion + 1} of {assessment.questions.length}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span className="flex items-center gap-1.5"><BookOpen size={14} />80% to pass</span>
              </div>
            </div>

            <div className={`flex flex-col items-center px-8 py-4 rounded-3xl border-2 transition-all duration-500 ${timeRemaining < 300 ? 'bg-red-50 border-red-200 text-red-500 animate-pulse' : 'bg-gray-50 border-gray-100 text-indigo-600'
              }`}>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-60">Time Remaining</span>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span className="font-mono text-2xl font-black">{formatTime(timeRemaining)}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8 h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / assessment.questions.length) * 100}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </motion.div>

        {/* Question Section */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card p-10 mb-8 bg-white border border-gray-200 shadow-xl rounded-2xl"
          >
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-black text-indigo-600 text-xl flex-shrink-0">
                {currentQuestion + 1}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-brand mb-10 leading-snug">
                  {question.question}
                </h2>

                <div className="grid grid-cols-1 gap-4">
                  {question.options.map((option, index) => {
                    const isSelected = answers[currentQuestion] === option;
                    return (
                      <motion.label
                        key={index}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className={`flex items-center p-6 rounded-2xl cursor-pointer border-2 transition-all duration-300 relative overflow-hidden group/opt ${isSelected ? 'bg-indigo-50 border-indigo-500' : 'bg-gray-50 border-gray-100 hover:bg-white hover:border-indigo-200'
                          }`}
                      >
                        {isSelected && (
                          <motion.div
                            layoutId="active-opt"
                            className="absolute inset-0 bg-indigo-500/5 -z-10"
                          />
                        )}
                        <div className={`w-6 h-6 rounded-lg border-2 mr-6 flex items-center justify-center transition-all ${isSelected ? 'bg-indigo-500 border-indigo-500' : 'bg-transparent border-gray-300 group-hover/opt:border-indigo-300'
                          }`}>
                          {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                        </div>
                        <input
                          type="radio"
                          name={`q-${currentQuestion}`}
                          checked={isSelected}
                          onChange={() => handleAnswerChange(currentQuestion, option)}
                          className="hidden"
                        />
                        <span className={`text-lg transition-all ${isSelected ? 'text-brand font-bold' : 'text-gray-500 group-hover/opt:text-brand'}`}>
                          {option}
                        </span>
                      </motion.label>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="flex justify-between items-center gap-6">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="btn-premium bg-white border border-gray-200 text-brand hover:bg-gray-50 !py-3 !px-6 disabled:opacity-50"
          >
            <ChevronLeft size={18} /> Back
          </button>

          <div className="flex gap-2">
            {assessment.questions.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentQuestion ? 'w-8 bg-indigo-500' : answers[idx] ? 'w-2 bg-emerald-500' : 'w-2 bg-gray-300'
                  }`}
              />
            ))}
          </div>

          {currentQuestion === assessment.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-premium btn-primary !py-3 !px-10"
            >
              {submitting ? 'Submitting...' : 'Finish Quest'}
              <ArrowRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="btn-premium btn-primary !py-3 !px-8"
            >
              Next Question <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const AssessmentResults = ({ results, courseId, onRetake, isEmbedded = false }) => {
  const navigate = useNavigate();
  const [downloadingCert, setDownloadingCert] = useState(false);
  const isPassed = results.attempt?.passed ?? results.passed;

  const handleDownloadCertificate = async () => {
    try {
      setDownloadingCert(true);
      let certificateId = results.certificate?.id || results.certificate?._id || results.certificate?.certificateId || results.certificateId;

      if (!certificateId) throw new Error('Certificate ID not found. Please refresh.');

      await certificateService.downloadCertificate(certificateId);
      toast.success('Certificate Secured!');
    } catch (error) {
      toast.error(error.message || 'Download failed');
    } finally {
      setDownloadingCert(false);
    }
  };

  return (
    <div className={`${isEmbedded ? 'py-10' : 'min-h-screen bg-[var(--bg-main)] py-24'} px-4 overflow-hidden relative`}>
      {/* Victory/Defeat Background Glow */}
      {!isEmbedded && (
        <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 blur-[150px] opacity-20 pointer-events-none transition-colors duration-1000 ${isPassed ? 'bg-emerald-200' : 'bg-red-200'
          }`}></div>
      )}

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="glass-card overflow-hidden bg-white border border-gray-200 shadow-xl rounded-2xl"
        >
          {/* Hero State */}
          <div className={`p-16 text-center relative overflow-hidden ${isPassed ? 'bg-emerald-50' : 'bg-red-50'}`}>
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl relative z-10 ${isPassed ? 'bg-emerald-500 text-white animate-float' : 'bg-red-500 text-white'
                }`}
            >
              {isPassed ? <Award size={64} /> : <XCircle size={64} />}
            </motion.div>

            <h2 className="text-5xl md:text-6xl font-black text-brand mb-6 uppercase tracking-tighter">
              {isPassed ? 'Mastery Achieved' : 'Oops... You failed!'}
            </h2>

            <p className="text-xl text-gray-500 max-w-xl mx-auto font-medium leading-[1.6]">
              {isPassed
                ? "You've successfully conquered the final challenge. Your professional certification is ready for validation."
                : "You didn’t pass this time. Please review the lessons and try the quiz again."
              }
            </p>
          </div>

          {/* Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 border-t border-gray-100 bg-gray-50">
            <ResultStat label="Sync Score" value={`${results.attempt?.score ?? results.score ?? 0}`} sub={`of ${results.attempt?.totalPoints ?? results.totalPoints ?? 0} pts`} />
            <ResultStat label="Course Accuracy" value={`${results.attempt?.percentageScore ?? results.percentageScore ?? 0}%`} sub="80% required" highlight={isPassed} />
            <ResultStat label="Course Rank" value={results.attempt?.grade ?? results.grade ?? 'N/A'} sub="Standard Certified" />
          </div>

          {/* Footer Actions */}
          <div className="p-10 flex flex-col sm:flex-row justify-center gap-4 bg-white">
            {isPassed ? (
              <button
                onClick={handleDownloadCertificate}
                disabled={downloadingCert}
                className="btn-premium btn-primary !py-4 !px-12 text-lg"
              >
                {downloadingCert ? 'Downloading Certificate...' : 'Generate Certificate'}
                <Award size={20} />
              </button>
            ) : (
              <button
                onClick={onRetake}
                className="btn-premium bg-indigo-600 hover:bg-indigo-700 text-white !py-4 !px-12 text-lg"
              >
                Restart Synchronization <RefreshCw size={20} />
              </button>
            )}

            <button
              onClick={() => navigate(`/courses/${courseId}`)}
              className="btn-premium bg-white border border-gray-200 text-brand hover:bg-gray-50 !py-4 !px-10"
            >
              Back to Module Hub
            </button>
          </div>
        </motion.div>

        {/* Review Modules */}
        <div className="mt-16">
          <h3 className="text-gray-400 font-black uppercase tracking-[0.2em] text-xs mb-8 flex items-center gap-3">
            <span className="w-8 h-px bg-gray-300"></span>
            Assessment Review
          </h3>

          <div className="space-y-6">
            {(results.attempt?.results ?? results.results ?? []).map((result, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                key={idx}
                className={`glass-card p-6 border-l-4 rounded-xl shadow-sm bg-white ${result.isCorrect ? 'border-l-emerald-500' : 'border-l-red-500'}`}
              >
                <div className="flex gap-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${result.isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    {result.isCorrect ? <CheckCircle size={20} /> : <XCircle size={20} />}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-brand font-bold text-lg mb-4">{result.question}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1 block">Your Response</span>
                        <span className={`font-bold ${result.isCorrect ? 'text-emerald-600' : 'text-red-500'}`}>{result.userAnswer}</span>
                      </div>

                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ResultStat = ({ label, value, sub, highlight }) => (
  <div className="p-10 text-center flex flex-col items-center group">
    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">{label}</span>
    <div className={`text-5xl font-black mb-1 transition-all duration-500 ${highlight ? 'text-emerald-500 scale-110 drop-shadow-sm' : 'text-brand group-hover:text-accent'}`}>
      {value}
    </div>
    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{sub}</span>
  </div>
);

export default AssessmentCenter;