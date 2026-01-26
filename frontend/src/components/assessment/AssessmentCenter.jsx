import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, Award, AlertCircle, RefreshCw } from 'lucide-react';
import assessmentService from '../../services/assessmentService';
import certificateService from '../../services/certificateService';

const AssessmentCenter = () => {
  const { courseId } = useParams();
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
      setError('Please answer all questions before submitting');
      return;
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (error && !assessment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{assessment.title}</h1>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${timeRemaining < 300 ? 'text-red-600' : 'text-gray-600'}`}>
                <Clock className="h-5 w-5" />
                <span className="font-mono">{formatTime(timeRemaining)}</span>
              </div>
              <div className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {assessment.questions.length}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {question.question}
            </h2>
            {question.points && (
              <p className="text-sm text-gray-600">Points: {question.points}</p>
            )}
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  answers[currentQuestion] === option
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  value={option}
                  checked={answers[currentQuestion] === option}
                  onChange={() => handleAnswerChange(currentQuestion, option)}
                  className="mr-3 text-indigo-600"
                />
                <span className="text-gray-900">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex space-x-2">
            {assessment.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 rounded-full text-sm font-medium ${
                  index === currentQuestion
                    ? 'bg-indigo-600 text-white'
                    : answers[index] !== null
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestion === assessment.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={submitting || answers.includes(null)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Assessment</span>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Next
            </button>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}
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
    } catch (error) {
      console.error('Failed to download certificate:', error);
    } finally {
      setDownloadingCert(false);
    }
  };

  const handleRetakeAssessment = () => {
    navigate(`/assessment/${courseId}`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Results Header */}
        <div className={`bg-white rounded-lg shadow-sm p-8 mb-6 ${
          results.attempt.passed ? 'border-green-200' : 'border-red-200'
        }`}>
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
              results.attempt.passed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {results.attempt.passed ? (
                <CheckCircle className="h-10 w-10 text-green-600" />
              ) : (
                <XCircle className="h-10 w-10 text-red-600" />
              )}
            </div>
            
            <h1 className={`text-3xl font-bold mb-2 ${
              results.attempt.passed ? 'text-green-600' : 'text-red-600'
            }`}>
              {results.attempt.passed ? 'Congratulations!' : 'Assessment Not Passed'}
            </h1>
            
            <p className="text-gray-600 mb-6">
              {results.attempt.passed 
                ? 'You have successfully passed the assessment and completed the course!'
                : 'You did not meet the passing criteria. Please review the material and try again.'
              }
            </p>

            {/* Score Display */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {results.attempt.score}/{results.attempt.totalPoints}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Percentage</p>
                <p className="text-2xl font-bold text-gray-900">
                  {results.attempt.percentageScore}%
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Grade</p>
                <p className={`text-2xl font-bold ${
                  results.attempt.passed ? 'text-green-600' : 'text-red-600'
                }`}>
                  {results.attempt.grade}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              {results.attempt.passed && results.certificate && (
                <button
                  onClick={handleDownloadCertificate}
                  disabled={downloadingCert}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  <Award className="h-5 w-5" />
                  <span>
                    {downloadingCert ? 'Downloading...' : 'Download Certificate'}
                  </span>
                </button>
              )}
              
              {!results.attempt.passed && results.nextAttemptAvailable && (
                <button
                  onClick={handleRetakeAssessment}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
                >
                  <RefreshCw className="h-5 w-5" />
                  <span>Retake Assessment</span>
                </button>
              )}
              
              <button
                onClick={() => navigate(`/courses/${courseId}`)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back to Course
              </button>
            </div>

            {!results.attempt.passed && !results.nextAttemptAvailable && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">
                  You have reached the maximum number of attempts. Please contact support for assistance.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Results */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Detailed Results</h2>
          <div className="space-y-4">
            {results.attempt.results.map((result, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg ${
                  result.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-2">
                      {index + 1}. {result.question}
                    </p>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Your answer:</span>{' '}
                        <span className={result.isCorrect ? 'text-green-600' : 'text-red-600'}>
                          {result.userAnswer}
                        </span>
                      </p>
                      {!result.isCorrect && (
                        <p>
                          <span className="font-medium">Correct answer:</span>{' '}
                          <span className="text-green-600">{result.correctAnswer}</span>
                        </p>
                      )}
                      {result.explanation && (
                        <p className="text-gray-600 mt-2">{result.explanation}</p>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    {result.isCorrect ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentCenter;