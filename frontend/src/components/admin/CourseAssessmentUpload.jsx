import React, { useState, useEffect } from 'react';
import { Upload, FileText, Download, AlertCircle, CheckCircle, Eye, Edit, Trash2, Plus, X } from 'lucide-react';
import assessmentUploadService from '../../services/assessmentUploadService';

const CourseAssessmentUpload = ({ courseId, onAssessmentUploaded, existingQuiz }) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [template, setTemplate] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [jsonInput, setJsonInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    loadTemplate();
  }, []);

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
      
      // Preview file content if JSON
      if (file.type === 'application/json') {
        try {
          const text = await file.text();
          const data = JSON.parse(text);
          setJsonInput(JSON.stringify(data, null, 2));
        } catch (error) {
          console.error('Failed to parse JSON file:', error);
        }
      }
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
      
      const result = await assessmentUploadService.importFromFile(selectedFile, courseId);
      setSuccess('Assessment uploaded and linked to course successfully!');
      setSelectedFile(null);
      setJsonInput('');
      onAssessmentUploaded && onAssessmentUploaded(result.quiz);
      
      // Reset file input
      document.getElementById('courseFileInput').value = '';
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
      
      const result = await assessmentUploadService.uploadAssessment(assessmentData, courseId);
      setSuccess('Assessment uploaded and linked to course successfully!');
      setJsonInput('');
      onAssessmentUploaded && onAssessmentUploaded(result.quiz);
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

  const downloadTemplate = () => {
    if (template) {
      const dataStr = JSON.stringify(template, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = 'course-assessment-template.json';
      
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
    const exportFileDefaultName = 'course-assessment-template.csv';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Course Assessment</h3>
          {existingQuiz && (
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                Assessment Added
              </span>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="p-1 text-gray-600 hover:text-indigo-600"
                title="Preview Assessment"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {existingQuiz && !showPreview && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <p className="text-green-800 font-medium">Assessment Already Added</p>
                <p className="text-green-600 text-sm">
                  {existingQuiz.questionCount} questions • {existingQuiz.timeLimit} minutes • {existingQuiz.passingScore}% passing
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowPreview(true)}
              className="mt-3 text-sm text-green-600 hover:text-green-700 font-medium"
            >
              View Assessment Details →
            </button>
          </div>
        )}

        {showPreview && existingQuiz && (
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-medium text-gray-900">{existingQuiz.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{existingQuiz.description}</p>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Questions:</span>
                <span className="ml-2 font-medium">{existingQuiz.questionCount}</span>
              </div>
              <div>
                <span className="text-gray-500">Time:</span>
                <span className="ml-2 font-medium">{existingQuiz.timeLimit}min</span>
              </div>
              <div>
                <span className="text-gray-500">Passing:</span>
                <span className="ml-2 font-medium">{existingQuiz.passingScore}%</span>
              </div>
              <div>
                <span className="text-gray-500">Attempts:</span>
                <span className="ml-2 font-medium">{existingQuiz.maxAttempts}</span>
              </div>
            </div>
          </div>
        )}

        {!existingQuiz && (
          <>
            {/* Success/Error Messages */}
            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-green-800">{success}</span>
              </div>
            )}

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-red-800">{error}</span>
              </div>
            )}

            {/* Upload Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('file')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'file'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Upload File
                </button>
                <button
                  onClick={() => setActiveTab('json')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'json'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  JSON Input
                </button>
              </nav>
            </div>

            {/* File Upload Tab */}
            {activeTab === 'file' && (
              <div className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <div className="mb-4">
                    <label htmlFor="courseFileInput" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Click to upload or drag and drop
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        JSON or CSV files up to 5MB
                      </span>
                    </label>
                    <input
                      id="courseFileInput"
                      type="file"
                      className="sr-only"
                      accept=".json,.csv"
                      onChange={handleFileUpload}
                    />
                  </div>
                  
                  {selectedFile && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center">
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

                {/* Templates */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Download Templates</h4>
                  <div className="flex space-x-3">
                    <button
                      onClick={downloadTemplate}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2 text-sm"
                    >
                      <Download className="h-4 w-4" />
                      <span>JSON Template</span>
                    </button>
                    <button
                      onClick={downloadCSVTemplate}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2 text-sm"
                    >
                      <Download className="h-4 w-4" />
                      <span>CSV Template</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* JSON Input Tab */}
            {activeTab === 'json' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Assessment JSON Data</h4>
                  <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder="Paste your assessment JSON data here..."
                    className="w-full h-48 p-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <button
                    onClick={downloadTemplate}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2 text-sm"
                  >
                    <Download className="h-4 w-4" />
                    <span>Get Template</span>
                  </button>
                  
                  <button
                    onClick={handleJsonUpload}
                    disabled={!jsonInput.trim() || uploading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {uploading ? 'Uploading...' : 'Upload Assessment'}
                  </button>
                </div>
              </div>
            )}

            {/* Template Preview */}
            {template && activeTab === 'json' && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Template Structure</h4>
                <div className="bg-gray-50 rounded-lg p-3 max-h-48 overflow-y-auto">
                  <pre className="text-xs text-gray-700">
                    {JSON.stringify(template, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CourseAssessmentUpload;