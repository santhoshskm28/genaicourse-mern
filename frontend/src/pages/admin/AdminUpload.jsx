import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiUploadCloud, FiFileText, FiCheckCircle, FiLoader, FiAlertCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const AdminUpload = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [convertedData, setConvertedData] = useState(null);
    const [progress, setProgress] = useState(0);

    const onFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
        } else {
            toast.error('Please select a valid PDF file');
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsProcessing(true);
        setProgress(20);

        const formData = new FormData();
        formData.append('file', file);

        try {
            setProgress(40);
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/admin/courses/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    if (percentCompleted < 90) setProgress(40 + (percentCompleted / 2));
                }
            });

            if (res.data.success) {
                setProgress(100);
                setConvertedData(res.data.data);
                toast.success('Course converted successfully! Please review.');
            }
        } catch (error) {
            console.error('Upload error:', error);
            const errMsg = error.response?.data?.message || 'Failed to convert course';
            toast.error(errMsg);
            setProgress(0);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSave = async () => {
        if (!convertedData) return;

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/admin/courses/save', convertedData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.data.success) {
                toast.success('Course saved to database!');
                navigate('/admin/dashboard');
            }
        } catch (error) {
            console.error('Save error:', error.response?.data);
            const errMsg = error.response?.data?.message || 'Failed to save course';
            const details = error.response?.data?.errors?.map(err => `${err.path.join('.')}: ${err.message}`).join(', ') || '';
            toast.error(`${errMsg}${details ? ': ' + details : ''}`);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">AI Course Conversion</h1>
                <p className="text-slate-400">Upload a PDF to automatically generate a structured course with modules and lessons.</p>
            </div>

            {!convertedData ? (
                <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 shadow-xl">
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-600 rounded-xl p-12 transition-colors hover:border-primary/50 group">
                        <input
                            type="file"
                            id="pdf-upload"
                            className="hidden"
                            accept=".pdf"
                            onChange={onFileChange}
                            disabled={isProcessing}
                        />
                        <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center">
                            <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                                <FiUploadCloud className="text-4xl text-slate-400 group-hover:text-primary transition-colors" />
                            </div>
                            <span className="text-lg font-medium text-white mb-2">
                                {file ? file.name : 'Click or Drag PDF to Upload'}
                            </span>
                            <span className="text-sm text-slate-500">Maximum file size: 10MB</span>
                        </label>
                    </div>

                    {isProcessing && (
                        <div className="mt-8 space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-400 flex items-center gap-2">
                                    <FiLoader className="animate-spin text-primary" />
                                    Phase {progress < 50 ? '1' : progress < 90 ? '2' : '3'}: Processing AI Conversion...
                                </span>
                                <span className="text-white font-medium">{progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleUpload}
                        disabled={!file || isProcessing}
                        className={`w-full mt-8 py-4 rounded-xl font-bold text-lg transition-all ${!file || isProcessing
                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            : 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/20 hover:-translate-y-1'
                            }`}
                    >
                        {isProcessing ? 'Processing...' : 'Start Conversion'}
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                        <div className="p-6 border-b border-slate-700 bg-slate-800/50 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white">Course Preview</h2>
                                <p className="text-sm text-slate-400">Review the AI-generated structure before saving.</p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setConvertedData(null)}
                                    className="px-6 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold flex items-center gap-2 shadow-lg shadow-green-900/20"
                                >
                                    <FiCheckCircle /> Confirm & Save Course
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2">
                                    <h3 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">Title</h3>
                                    <input
                                        type="text"
                                        value={convertedData.title}
                                        onChange={(e) => setConvertedData({ ...convertedData, title: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white font-bold text-xl focus:border-primary outline-none"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">Category</h3>
                                        <select
                                            value={convertedData.category}
                                            onChange={(e) => setConvertedData({ ...convertedData, category: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-primary"
                                        >
                                            <option value="AI/ML">AI/ML</option>
                                            <option value="Web Development">Web Development</option>
                                            <option value="Data Science">Data Science</option>
                                            <option value="Cloud Computing">Cloud Computing</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <h3 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">Level</h3>
                                        <select
                                            value={convertedData.level}
                                            onChange={(e) => setConvertedData({ ...convertedData, level: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-primary"
                                        >
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-4">Course Content ({convertedData.modules.length} Modules)</h3>
                                <div className="space-y-6">
                                    {convertedData.modules.map((module, mIdx) => (
                                        <div key={mIdx} className="bg-slate-900/50 rounded-xl border border-slate-700 p-6 space-y-4">
                                            <div className="flex items-center gap-4">
                                                <span className="w-8 h-8 bg-slate-700 rounded-lg text-sm flex items-center justify-center font-bold">{mIdx + 1}</span>
                                                <input
                                                    type="text"
                                                    value={module.moduleTitle}
                                                    onChange={(e) => {
                                                        const newModules = [...convertedData.modules];
                                                        newModules[mIdx].moduleTitle = e.target.value;
                                                        setConvertedData({ ...convertedData, modules: newModules });
                                                    }}
                                                    className="flex-grow bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white font-bold outline-none focus:border-primary"
                                                    placeholder="Module Title"
                                                />
                                            </div>

                                            <div className="pl-12 space-y-4">
                                                {module.lessons.map((lesson, lIdx) => (
                                                    <div key={lIdx} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 space-y-3">
                                                        <div className="flex items-center gap-3">
                                                            <FiFileText className="text-slate-500" />
                                                            <input
                                                                type="text"
                                                                value={lesson.lessonTitle}
                                                                onChange={(e) => {
                                                                    const newModules = [...convertedData.modules];
                                                                    newModules[mIdx].lessons[lIdx].lessonTitle = e.target.value;
                                                                    setConvertedData({ ...convertedData, modules: newModules });
                                                                }}
                                                                className="flex-grow bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-primary"
                                                                placeholder="Lesson Title"
                                                            />
                                                        </div>
                                                        <textarea
                                                            value={lesson.content}
                                                            onChange={(e) => {
                                                                const newModules = [...convertedData.modules];
                                                                newModules[mIdx].lessons[lIdx].content = e.target.value;
                                                                setConvertedData({ ...convertedData, modules: newModules });
                                                            }}
                                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-400 min-h-[100px] outline-none focus:border-primary"
                                                            placeholder="Lesson Content"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {convertedData.quiz && convertedData.quiz.length > 0 && (
                                <div className="bg-violet-900/10 rounded-xl border border-violet-500/30 p-4">
                                    <h3 className="text-xs uppercase tracking-wider text-violet-400 font-bold mb-4 flex items-center gap-2">
                                        <FiAlertCircle /> AI Extracted Quizzes ({convertedData.quiz.length} Questions)
                                    </h3>
                                    <div className="space-y-3">
                                        {convertedData.quiz.map((q, qIdx) => (
                                            <div key={qIdx} className="text-sm text-slate-300 pl-4 border-l-2 border-violet-500/30 py-1">
                                                {q.question}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUpload;
