import React, { useState, useEffect } from 'react';
import { Upload, FileText, Download, AlertCircle, CheckCircle, Eye, Edit, Trash2, Plus } from 'lucide-react';
import assessmentUploadService from '../../services/assessmentUploadService.js';
import adminService from '../../services/adminService.js';

const AdminAssessmentManager = () => {
    const [activeTab, setActiveTab] = useState('manage');
    const [assessments, setAssessments] = useState([]);
    const [template, setTemplate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [jsonInput, setJsonInput] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        loadAssessments();
        loadTemplate();
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            const data = await adminService.getAllCourses();
            setCourses(data.data || []);
        } catch (error) {
            console.error('Failed to load courses:', error);
        }
    };

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
            setActiveTab('manage');

            // Reset file input
            const fileInput = document.getElementById('fileInput');
            if (fileInput) fileInput.value = '';
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
            setActiveTab('manage');
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
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

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
        <div className="bg-slate-900 text-slate-300">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Assessments</h2>
                    <p className="text-slate-400">Manage and upload course assessments</p>
                </div>
                {activeTab === 'manage' && (
                    <button
                        onClick={() => setActiveTab('upload')}
                        className="btn bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Upload New</span>
                    </button>
                )}
                {activeTab === 'upload' && (
                    <button
                        onClick={() => setActiveTab('manage')}
                        className="btn bg-slate-700 hover:bg-slate-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                    >
                        <span>Cancel</span>
                    </button>
                )}
            </div>

            {/* Success/Error Messages */}
            {success && (
                <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center text-emerald-400 animate-in fade-in slide-in-from-top-2">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span>{success}</span>
                    <button onClick={() => setSuccess('')} className="ml-auto hover:text-white">×</button>
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center text-red-400 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span>{error}</span>
                    <button onClick={() => setError('')} className="ml-auto hover:text-white">×</button>
                </div>
            )}

            {/* Tabs Content */}
            {activeTab === 'upload' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">

                    {/* Course Selection */}
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Select Course (Optional)
                        </label>
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                        >
                            <option value="">-- Don't link to a course yet --</option>
                            {courses.map(course => (
                                <option key={course._id || course.id} value={course._id || course.id}>
                                    {course.title}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-slate-500 mt-2">
                            If selected, the assessment will be automatically linked to this course.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Wrapper for two columns */}

                        {/* File Upload Column */}
                        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                                <Upload className="mr-2 h-5 w-5 text-indigo-400" />
                                File Upload
                            </h3>
                            <div className="border-2 border-dashed border-slate-600 hover:border-indigo-500 rounded-lg p-8 text-center transition-colors bg-slate-800/50">
                                <Upload className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                                <div className="mb-4">
                                    <label htmlFor="fileInput" className="cursor-pointer block">
                                        <span className="text-indigo-400 hover:text-indigo-300 font-medium">Click to upload</span>
                                        <span className="text-slate-400"> or drag and drop</span>
                                    </label>
                                    <p className="text-xs text-slate-500 mt-1">JSON or CSV files up to 5MB</p>
                                    <input
                                        id="fileInput"
                                        type="file"
                                        className="hidden"
                                        accept=".json,.csv"
                                        onChange={handleFileUpload}
                                    />
                                </div>

                                {selectedFile && (
                                    <div className="mb-4 p-3 bg-slate-700 rounded-lg flex items-center justify-between">
                                        <div className="flex items-center">
                                            <FileText className="h-5 w-5 text-indigo-400 mr-2" />
                                            <span className="text-sm text-white">{selectedFile.name}</span>
                                        </div>
                                        <button onClick={() => setSelectedFile(null)} className="text-slate-400 hover:text-white">×</button>
                                    </div>
                                )}

                                <button
                                    onClick={handleFileImport}
                                    disabled={!selectedFile || uploading}
                                    className={`w-full py-2 rounded-lg font-medium transition-colors ${!selectedFile || uploading
                                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                        }`}
                                >
                                    {uploading ? 'Importing...' : 'Import File'}
                                </button>
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-700">
                                <h4 className="text-sm font-semibold text-slate-300 mb-3">Download Templates</h4>
                                <div className="flex gap-3">
                                    <button
                                        onClick={downloadTemplate}
                                        className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-white flex items-center justify-center gap-2 transition-colors border border-slate-600"
                                    >
                                        <Download className="h-4 w-4" /> JSON
                                    </button>
                                    <button
                                        onClick={downloadCSVTemplate}
                                        className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-white flex items-center justify-center gap-2 transition-colors border border-slate-600"
                                    >
                                        <Download className="h-4 w-4" /> CSV
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* JSON Input Column */}
                        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                                <FileText className="mr-2 h-5 w-5 text-emerald-400" />
                                Paste JSON
                            </h3>
                            <div className="relative">
                                <textarea
                                    value={jsonInput}
                                    onChange={(e) => setJsonInput(e.target.value)}
                                    placeholder={`{
  "title": "My Assessment",
  "questions": [...]
}`}
                                    className="w-full h-[320px] bg-slate-900 border border-slate-600 rounded-lg p-4 font-mono text-sm text-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
                                />
                                <div className="absolute bottom-4 right-4">
                                    <button
                                        onClick={handleJsonUpload}
                                        disabled={!jsonInput.trim() || uploading}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${!jsonInput.trim() || uploading
                                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20'
                                            }`}
                                    >
                                        {uploading ? 'Uploading...' : 'Upload JSON'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'manage' && (
                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-slate-400">
                            <thead className="bg-slate-900/50 text-slate-200 uppercase text-xs font-semibold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Title</th>
                                    <th className="px-6 py-4">Course</th>
                                    <th className="px-6 py-4">Stats</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mb-2"></div>
                                            <p className="text-slate-500">Loading assessments...</p>
                                        </td>
                                    </tr>
                                ) : assessments.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                            <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                            <p>No assessments found</p>
                                            <button
                                                onClick={() => setActiveTab('upload')}
                                                className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                                            >
                                                Upload your first assessment
                                            </button>
                                        </td>
                                    </tr>
                                ) : (
                                    assessments.map((assessment) => (
                                        <tr key={assessment.id} className="hover:bg-slate-700/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-white">{assessment.title}</div>
                                                <div className="text-xs text-slate-500 mt-1 truncate max-w-[200px]">{assessment.description}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {assessment.courseTitle ? (
                                                    <span className="text-indigo-400">{assessment.courseTitle}</span>
                                                ) : (
                                                    <span className="text-slate-600 italic">Not linked</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex flex-col gap-1">
                                                    <span className="flex items-center gap-2">
                                                        <FileText className="w-3 h-3" /> {assessment.questionCount} Qs
                                                    </span>
                                                    <span className="text-slate-500">
                                                        {assessment.timeLimit} mins • {assessment.passingScore}% pass
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${assessment.isActive
                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                    : 'bg-slate-600/30 text-slate-400 border border-slate-600'
                                                    }`}>
                                                    {assessment.isActive ? 'Active' : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-700 rounded-lg transition-colors" title="View">
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors" title="Edit">
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteAssessment(assessment.id)}
                                                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAssessmentManager;
