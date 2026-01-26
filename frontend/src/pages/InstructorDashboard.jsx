import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Edit, Trash2, Eye, Users, Clock, Award, BarChart3 } from 'lucide-react';
import assessmentUploadService from '../../services/assessmentUploadService';
import AssessmentUpload from './AssessmentUpload.jsx';

const InstructorDashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  useEffect(() => {
    if (activeView === 'dashboard' || activeView === 'manage') {
      loadAssessments();
    }
  }, [activeView]);

  const loadAssessments = async () => {
    try {
      setLoading(true);
      const data = await assessmentUploadService.getInstructorAssessments();
      setAssessments(data.assessments);
    } catch (error) {
      console.error('Failed to load assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAssessment = async (assessmentId) => {
    if (!window.confirm('Are you sure you want to delete this assessment?')) {
      return;
    }

    try {
      await assessmentUploadService.deleteAssessment(assessmentId);
      loadAssessments();
    } catch (error) {
      console.error('Failed to delete assessment:', error);
    }
  };

  const filteredAssessments = assessments.filter(assessment =>
    assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (assessment.courseTitle && assessment.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const stats = {
    totalAssessments: assessments.length,
    activeAssessments: assessments.filter(a => a.isActive).length,
    totalQuestions: assessments.reduce((sum, a) => sum + a.questionCount, 0),
    avgTimeLimit: assessments.length > 0 
      ? Math.round(assessments.reduce((sum, a) => sum + a.timeLimit, 0) / assessments.length)
      : 0
  };

  if (activeView === 'upload') {
    return <AssessmentUpload />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Instructor Dashboard</h1>
          <p className="text-gray-600">Manage your assessments and track student progress</p>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeView === 'dashboard'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveView('manage')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeView === 'manage'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Manage Assessments
              </button>
              <button
                onClick={() => setActiveView('upload')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeView === 'upload'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Upload New
              </button>
            </nav>
          </div>
        </div>

        {activeView === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-lg p-3">
                    <FileText className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalAssessments}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeAssessments}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-100 rounded-lg p-3">
                    <Award className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Questions</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalQuestions}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg. Time Limit</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.avgTimeLimit}m</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Assessments */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Recent Assessments</h2>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  </div>
                ) : filteredAssessments.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No assessments found</p>
                    <button
                      onClick={() => setActiveView('upload')}
                      className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Create Your First Assessment
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAssessments.slice(0, 5).map((assessment) => (
                      <div key={assessment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{assessment.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {assessment.questionCount} questions • {assessment.timeLimit}min • 
                            {assessment.maxAttempts} attempts
                          </p>
                          {assessment.courseTitle && (
                            <p className="text-sm text-indigo-600 mt-1">
                              {assessment.courseTitle}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            assessment.isActive 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {assessment.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <button
                            onClick={() => setActiveView('manage')}
                            className="p-2 text-gray-600 hover:text-indigo-600"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeView === 'manage' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Manage Assessments</h2>
                <button
                  onClick={() => setActiveView('upload')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Assessment</span>
                </button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="px-6 py-4 border-b">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search assessments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {/* Assessments List */}
            <div className="divide-y">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                </div>
              ) : filteredAssessments.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No assessments found</p>
                </div>
              ) : (
                filteredAssessments.map((assessment) => (
                  <div key={assessment.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium text-gray-900">{assessment.title}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            assessment.isActive 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {assessment.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mt-1">{assessment.description}</p>
                        
                        <div className="flex items-center space-x-6 mt-3 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Award className="h-4 w-4" />
                            <span>{assessment.questionCount} questions</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{assessment.timeLimit} minutes</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{assessment.maxAttempts} attempts</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <BarChart3 className="h-4 w-4" />
                            <span>{assessment.passingScore}% passing</span>
                          </span>
                        </div>

                        {assessment.courseTitle && (
                          <p className="text-sm text-indigo-600 mt-2">
                            Course: {assessment.courseTitle}
                          </p>
                        )}

                        <p className="text-xs text-gray-500 mt-2">
                          Created: {new Date(assessment.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          className="p-2 text-gray-600 hover:text-indigo-600"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 text-gray-600 hover:text-indigo-600"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAssessment(assessment.id)}
                          className="p-2 text-gray-600 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;