import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api.js';

const AdminJSONUpload = () => {
    const navigate = useNavigate();
    const [jsonInput, setJsonInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!jsonInput.trim()) {
            toast.error('Please enter JSON data');
            return;
        }

        try {
            setIsSaving(true);
            const parsedData = JSON.parse(jsonInput); // Validate JSON

            const token = localStorage.getItem('token');
            const res = await api.post('http://localhost:5000/api/admin/courses/save-json', parsedData);

            if (res.data.success) {
                toast.success('Course uploaded successfully!');
                navigate('/admin/dashboard');
            }
        } catch (error) {
            console.error('Save error:', error);
            if (error instanceof SyntaxError) {
                toast.error('Invalid JSON format');
            } else {
                const errMsg = error.response?.data?.message || 'Failed to save course';
                toast.error(errMsg);
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl pt-28">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">JSON Course Publisher</h1>
                <p className="text-slate-400">Paste your course JSON data below to upload a new course.</p>
            </div>

            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8">
                <div className="mb-6">
                    <label className="block text-white font-medium mb-2">Course JSON Data</label>
                    <textarea
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        placeholder={`Paste your course JSON here, e.g.:
{
  "title": "Introduction to React",
  "description": "Learn React basics",
  "category": "Web Development",
  "level": "Beginner",
  "modules": [
    {
      "moduleTitle": "Getting Started",
      "lessons": [
        {
          "lessonTitle": "What is React?",
          "content": "React is a JavaScript library...",
          "keyPoints": ["Component-based", "Declarative"]
        }
      ]
    }
  ]
}`}
                        className="w-full h-96 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-primary outline-none"
                        disabled={isSaving}
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="px-6 py-3 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors"
                        disabled={isSaving}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!jsonInput.trim() || isSaving}
                        className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all ${!jsonInput.trim() || isSaving
                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20'
                            }`}
                    >
                        {isSaving ? 'Publishing...' : 'Publish Course'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminJSONUpload;