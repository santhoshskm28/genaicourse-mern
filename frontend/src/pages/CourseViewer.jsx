import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import courseService from '../services/courseService.js';
import Loader from '../components/common/Loader.jsx';
import { FaChevronLeft, FaChevronRight, FaCheck, FaBars, FaTimes, FaClipboardCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';

const CourseViewer = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState(null);
    const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const { data } = await courseService.getCourse(id);
                setCourse(data);
            } catch (error) {
                toast.error("Failed to load course");
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    if (loading) return <Loader />;
    if (!course) return <div className="text-center mt-20">Course not found</div>;

    const currentModule = course.modules[currentModuleIndex];
    const currentLesson = currentModule?.lessons[currentLessonIndex];

    const handleNext = () => {
        if (currentLessonIndex < currentModule.lessons.length - 1) {
            setCurrentLessonIndex(prev => prev + 1);
        } else if (currentModuleIndex < course.modules.length - 1) {
            setCurrentModuleIndex(prev => prev + 1);
            setCurrentLessonIndex(0);
        } else {
            // End of course
            if (course.quizId) {
                toast.success("All lessons completed! Redirecting to assessment...");
                setTimeout(() => {
                    navigate(`/courses/${id}/assessment`);
                }, 1500);
            } else {
                toast.success("Course Completed!");
                navigate('/dashboard');
            }
        }
    };

    const handlePrev = () => {
        if (currentLessonIndex > 0) {
            setCurrentLessonIndex(prev => prev - 1);
        } else if (currentModuleIndex > 0) {
            setCurrentModuleIndex(prev => prev - 1);
            setCurrentLessonIndex(course.modules[currentModuleIndex - 1].lessons.length - 1);
        }
    };

    return (
        <div className="flex h-screen bg-slate-900 text-white overflow-hidden font-sans">
            {/* Sidebar with Glassmorphism */}
            <motion.div
                initial={{ x: -300 }}
                animate={{ x: sidebarOpen ? 0 : -300 }}
                className="fixed md:relative z-20 h-full w-80 glass-panel border-r border-slate-700 flex flex-col"
            >
                <div className="p-5 border-b border-slate-700 flex justify-between items-center">
                    <h2 className="font-bold truncate">{course.title}</h2>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden"><FaTimes /></button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {course.modules.map((mod, mIdx) => (
                        <div key={mod._id}>
                            <div className="px-4 py-2 bg-slate-800/50 text-xs uppercase tracking-wider text-gray-400 font-semibold">
                                Module {mIdx + 1}
                            </div>
                            {mod.lessons.map((less, lIdx) => (
                                <button
                                    key={less._id}
                                    onClick={() => {
                                        setCurrentModuleIndex(mIdx);
                                        setCurrentLessonIndex(lIdx);
                                    }}
                                    className={`w-full text-left px-4 py-3 text-sm transition-all duration-200 border-l-4 ${mIdx === currentModuleIndex && lIdx === currentLessonIndex
                                        ? 'bg-primary/10 border-primary text-white'
                                        : 'border-transparent text-gray-400 hover:bg-slate-800'
                                        }`}
                                >
                                    {less.title}
                                </button>
                            ))}
                        </div>
                    ))}
                    {course.quizId && (
                        <div className="mt-4 border-t border-slate-700 pt-4">
                            <div className="px-4 py-2 bg-indigo-900/40 text-xs uppercase tracking-wider text-indigo-400 font-semibold">
                                Final Assessment
                            </div>
                            <button
                                onClick={() => navigate(`/courses/${id}/assessment`)}
                                className="w-full text-left px-4 py-3 text-sm transition-all duration-200 border-l-4 border-transparent text-gray-300 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                            >
                                <FaClipboardCheck className="text-indigo-400" />
                                Take Assessment
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full relative z-10">
                {/* Top Navigation */}
                <div className="glass-header h-16 flex items-center justify-between px-6">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white">
                        <FaBars size={20} />
                    </button>
                    <div className="text-sm text-gray-400">
                        {currentLessonIndex + 1} / {currentModule.lessons.length}
                    </div>
                </div>

                {/* Dynamic Content with Animation */}
                <div className="flex-1 overflow-y-auto p-6 md:p-12 flex justify-center">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentLesson._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="max-w-4xl w-full"
                        >
                            <span className="text-primary font-bold uppercase tracking-widest text-xs mb-2 block">
                                Module {currentModuleIndex + 1}: {currentModule.title}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                                {currentLesson.title}
                            </h1>

                            <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed mb-12">
                                {currentLesson.content.split('\n').map((p, i) => (
                                    <p key={i} className="mb-4">{p}</p>
                                ))}
                            </div>

                            {currentLesson.keyPoints?.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="glass-panel rounded-xl p-8 mb-12"
                                >
                                    <h3 className="text-xl font-bold mb-4 flex items-center">
                                        <span className="w-1.5 h-6 bg-secondary rounded mr-3"></span>
                                        Key Takeaways
                                    </h3>
                                    <ul className="grid gap-3">
                                        {currentLesson.keyPoints.map((point, idx) => (
                                            <li key={idx} className="flex items-start text-gray-300">
                                                <FaCheck className="text-emerald-400 mt-1 mr-3 flex-shrink-0" />
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Bottom Bar */}
                <div className="p-6 border-t border-slate-800 bg-slate-900/90 backdrop-blur">
                    <div className="max-w-4xl mx-auto flex justify-between">
                        <button
                            onClick={handlePrev}
                            disabled={currentModuleIndex === 0 && currentLessonIndex === 0}
                            className="btn btn-secondary disabled:opacity-50"
                        >
                            <FaChevronLeft className="mr-2" /> Previous
                        </button>
                        <button
                            onClick={handleNext}
                            className="btn btn-primary"
                        >
                            Next <FaChevronRight className="ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseViewer;
