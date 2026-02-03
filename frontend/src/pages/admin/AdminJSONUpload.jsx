import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api.js';

const AdminJSONUpload = () => {
    const navigate = useNavigate();
    const [jsonInput, setJsonInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        let cleanInput = jsonInput.trim();

        // Remove markdown backticks if present
        if (cleanInput.startsWith('```')) {
            cleanInput = cleanInput.replace(/^```json\n?|^```\n?/, '').replace(/\n?```$/, '');
        }

        if (!cleanInput) {
            toast.error('Please enter JSON data');
            return;
        }

        try {
            setIsSaving(true);

            let parsedData;
            try {
                parsedData = JSON.parse(cleanInput);
            } catch (err) {
                console.error('JSON Parse Error:', err);
                // Extract position from error message if possible
                const posMatch = err.message.match(/at position (\d+)/);
                if (posMatch) {
                    const pos = parseInt(posMatch[1]);
                    const preview = cleanInput.substring(Math.max(0, pos - 20), Math.min(cleanInput.length, pos + 20));
                    toast.error(`Invalid JSON near: "...${preview}..."`);
                } else {
                    toast.error('Invalid JSON format: ' + err.message);
                }
                setIsSaving(false);
                return;
            }

            const res = await api.post('/admin/courses/save-json', parsedData);

            if (res.data.success) {
                toast.success('Course published successfully!');
                navigate('/admin/dashboard');
            }
        } catch (error) {
            console.error('Save error:', error);
            const errMsg = error.response?.data?.message || error.response?.data?.errors?.[0] || 'Failed to save course';
            toast.error(errMsg);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-main)] tech-grid pt-32 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-brand mb-4">
                        JSON <span className="text-accent bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">Publisher</span>
                    </h1>
                    <p className="text-gray-500 text-lg font-medium">Upload structured course content directly via JSON.</p>
                </div>

                <div className="glass-card bg-white p-8 md:p-10 border border-gray-200">
                    <div className="mb-8 relative">
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-brand font-bold uppercase tracking-widest text-xs">Course Blueprint (JSON)</label>
                            <span className="text-[10px] text-gray-400 font-mono">UTF-8 ENCODED</span>
                        </div>
                        <textarea
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                            placeholder={`Paste your course JSON here...`}
                            className="w-full h-[500px] bg-gray-50 border border-gray-100 rounded-2xl px-6 py-6 text-brand font-mono text-sm focus:border-accent outline-none shadow-inner resize-none transition-all duration-300"
                            disabled={isSaving}
                        />

                        {/* Status indicators */}
                        <div className="absolute bottom-4 right-6 flex items-center gap-4">
                            <div className={`w-2 h-2 rounded-full ${jsonInput ? 'bg-green-500' : 'bg-gray-300'}`} />
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                {jsonInput.length.toLocaleString()} CHARACTERS
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            className="flex-1 px-8 py-4 rounded-xl border border-gray-200 text-gray-500 font-bold hover:bg-gray-50 transition-all active:scale-95"
                            disabled={isSaving}
                        >
                            Back to Command Center
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!jsonInput.trim() || isSaving}
                            className={`flex-[2] btn-premium btn-primary !rounded-xl text-lg ${!jsonInput.trim() || isSaving ? 'opacity-50 cursor-not-allowed grayscale' : ''
                                }`}
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    Processing Neural Data...
                                </>
                            ) : (
                                'Publish Global Access'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminJSONUpload;