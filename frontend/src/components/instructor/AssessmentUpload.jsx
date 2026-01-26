import React, { useState, useEffect } from 'react';
import { Upload, FileText, Download, AlertCircle, CheckCircle, Eye, Edit, Trash2, Plus } from 'lucide-react';
import assessmentUploadService from '../../services/assessmentUploadService';

const AssessmentUpload = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [assessments, setAssessments] = useState([]);
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [jsonInput, setJsonInput] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  useEffect(() => {
    loadAssessments();
    loadTemplate();
  }, []);

  const loadAssessments = async () => {
    try {
      setLoading(true);
      const data = await assessmentUploadService.getInstructorAssessments();
      setAssessments(data.assessments);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTemplate = async () => {
    try {
      const data = await assessmentUploadService.getTemplate();
      setTemplate(data.template);
    } catch (error) {
      console.error('Failed to load template:', error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError('');
    }
  };

  const handleFileImport = async () => {
    if (!selectedFile) {
      setError('Please select a file to import');
      return;
    }

    try {
      setUploading(true);
      setError('');
      
      const result = await assessmentUploadService.importFromFile(selectedFile, selectedCourse);
      setSuccess('Assessment imported successfully!');
      setSelectedFile(null);
      loadAssessments();
      
      // Reset file input
      document.getElementById('fileInput').value = '';
    } catch (error) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleJsonUpload = async () => {
    if (!jsonInput.trim()) {
      setError('Please enter assessment JSON data');
      return;
    }

    try {
      const assessmentData = JSON.parse(jsonInput);
      setUploading(true);
      setError('');
      
      const result = await assessmentUploadService.uploadAssessment(assessmentData, selectedCourse);
      setSuccess('Assessment uploaded successfully!');
      setJsonInput('');
      loadAssessments();
    } catch (error) {
      if (error instanceof SyntaxError) {
        setError('Invalid JSON format. Please check your data.');
      } else {
        setError(error.message);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAssessment = async (assessmentId) => {
    if (!window.confirm('Are you sure you want to delete this assessment?')) {
      return;
    }

    try {
      await assessmentUploadService.deleteAssessment(assessmentId);
      setSuccess('Assessment deleted successfully');
      loadAssessments();
    } catch (error) {
      setError(error.message);
    }
  };

  const downloadTemplate = () => {
    if (template) {
      const dataStr = JSON.stringify(template, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = 'assessment-template.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  const downloadCSVTemplate = () => {
    const csvTemplate = `Question,Option1,Option2,Option3,Option4,CorrectAnswer,Points,Explanation
"What is React?","A library","A framework","A database","An OS","A library","5","React is a JavaScript library for building user interfaces"
"What is Node.js?","Runtime","Language","Database","Browser","Runtime","5","Node.js is a JavaScript runtime built on Chrome's V8 engine"`;

    const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvTemplate);
    const exportFileDefaultName = 'assessment-template.csv';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Management</h1>
          <p className="text-gray-600">Upload and manage course assessments</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800">{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('upload')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'upload'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Upload Assessment
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'manage'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Manage Assessments
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'upload' && (
              <div className="space-y-8">
                {/* Upload Methods */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Method</h2>
                  
                  {/* File Upload */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Upload File (JSON/CSV)</h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <div className="mb-4">
                        <label htmlFor="fileInput" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            Click to upload or drag and drop
                          </span>
                          <span className="mt-1 block text-xs text-gray-500">
                            JSON or CSV files up to 5MB
                          </span>
                        </label>
                        <input
                          id="fileInput"
                          type="file"
                          className="sr-only"
                          accept=".json,.csv"
                          onChange={handleFileUpload}
                        />
                      </div>
                      
                      {selectedFile && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-gray-600 mr-2" />
                            <span className="text-sm text-gray-900">{selectedFile.name}</span>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={handleFileImport}
                        disabled={!selectedFile || uploading}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {uploading ? 'Importing...' : 'Import File'}
                      </button>
                    </div>
                  </div>

                  {/* JSON Input */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Paste JSON Data</h3>
                    <textarea
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                      placeholder="Paste your assessment JSON data here..."
                      className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      onClick={handleJsonUpload}
                      disabled={!jsonInput.trim() || uploading}
                      className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {uploading ? 'Uploading...' : 'Upload JSON'}
                    </button>
                  </div>

                  {/* Templates */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Download Templates</h3>
                    <div className="flex space-x-4">
                      <button
                        onClick={downloadTemplate}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <Download className="h-4 w-4" />
                        <span>JSON Template</span>
                      </button>
                      <button
                        onClick={downloadCSVTemplate}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <Download className="h-4 w-4" />
                        <span>CSV Template</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Template Preview */}
                {template && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Template Structure</h2>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <pre className="text-sm text-gray-700 overflow-x-auto">
                        {JSON.stringify(template, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'manage' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Assessments</h2>
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading assessments...</p>
                  </div>
                ) : assessments.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No assessments uploaded yet</p>
                    <button
                      onClick={() => setActiveTab('upload')}
                      className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Upload First Assessment
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assessments.map((assessment) => (
                      <div key={assessment.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900">{assessment.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {assessment.questionCount} questions • {assessment.timeLimit} minutes • 
                              {assessment.maxAttempts} attempts • {assessment.passingScore}% passing
                            </p>
                            {assessment.courseTitle && (
                              <p className="text-sm text-indigo-600 mt-1">
                                Course: {assessment.courseTitle}
                              </p>
                            )}
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
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentUpload;